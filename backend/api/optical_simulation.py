# backend/api/optical_simulation.py
from pathlib import Path
import io
import base64
import math
from PIL import Image, ImageFilter, ImageOps
import numpy as np

# Path to bundled Snellen chart in this app
ASSET_PATH = Path(__file__).resolve().parent / "assets" / "snellenchart.png"

def _load_chart(max_width=1600):
    """
    Load the bundled Snellen chart and optionally limit width for performance.
    """
    img = Image.open(ASSET_PATH).convert("RGB")
    if img.width > max_width:
        h = int(img.height * (max_width / img.width))
        img = img.resize((max_width, h), Image.BICUBIC)
    return img

def _apply_contrast_gamma(img: Image.Image, contrast: float, gamma: float) -> Image.Image:
    # contrast around 1.0 (0.5–1.5)
    img = ImageOps.autocontrast(img, cutoff=0)  # normalize histogram lightly
    enhancer = ImageOps.colorize(ImageOps.grayscale(img), black="black", white="white") if False else None
    # Cheap contrast: convert to numpy, scale around 128
    arr = np.asarray(img).astype(np.float32)
    arr = (arr - 127.5) * contrast + 127.5
    arr = np.clip(arr, 0, 255)

    # gamma correction
    arr = np.power(arr / 255.0, 1.0 / max(1e-6, gamma)) * 255.0
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def _simulate_chromatic(img: Image.Image, shift_pix: float, mode: str) -> Image.Image:
    """
    Very lightweight chromatic aberration: shift R and B opposite directions.
    mode:
      - 'achromatic' -> no shift
      - 'chromatic_rgb' -> simple R/B shift
    """
    if mode == "achromatic" or abs(shift_pix) < 0.25:
        return img

    r, g, b = img.split()
    # shift by subpixel using affine transform (translate)
    def shift(im, dx, dy):
        return im.transform(
            im.size,
            Image.AFFINE,
            (1, 0, dx, 0, 1, dy),
            resample=Image.BICUBIC,
        )

    r2 = shift(r, +shift_pix, 0)
    b2 = shift(b, -shift_pix, 0)
    return Image.merge("RGB", (r2, g, b2))

def _defocus_sigma_pixels(defocus_D: float, pupil_mm: float, px_per_mm: float) -> float:
    """
    Map diopters & pupil to an approximate blur sigma in pixels.
    This is a heuristic but monotonic and feels realistic enough for a demo:
      - Larger |D| => more blur
      - Larger pupil => more blur (depth of field shrinks)
      - Higher pixels/mm => more pixels per physical blur
    """
    # Base scale tuned visually; keep conservative to avoid over-blur.
    base = 0.18  # controls strength
    sigma_mm = base * abs(defocus_D) * (pupil_mm / 3.0)  # mm of blur on the retina image plane
    sigma_px = sigma_mm * px_per_mm
    return max(0.0, sigma_px)

def _gaussian_blur(img: Image.Image, sigma_px: float) -> Image.Image:
    if sigma_px <= 0.1:
        return img
    # Pillow uses radius ~ sigma; a bit larger feels closer to Gaussian sigma.
    radius = float(sigma_px)
    return img.filter(ImageFilter.GaussianBlur(radius=radius))

def simulate_chart(
    defocus_D: float = 0.0,
    pupil_mm: float = 3.0,
    px_per_mm: float = 4.0,
    chromatic_mode: str = "achromatic",  # "achromatic" | "chromatic_rgb"
    contrast: float = 1.0,
    gamma: float = 1.0,
):
    """
    Main entry: load the bundled chart, simulate optics/perception, return processed PIL image.
    """
    img = _load_chart()

    # 1) Defocus blur (approximate PSF)
    sigma_px = _defocus_sigma_pixels(defocus_D, pupil_mm, px_per_mm)
    img = _gaussian_blur(img, sigma_px)

    # 2) Simple longitudinal chromatic aberration (R/B split) proportional to defocus & pupil
    # small shift (pixels), bounded
    chroma_shift = np.sign(defocus_D) * min(2.5, 0.15 * abs(defocus_D) * (pupil_mm / 3.0) * px_per_mm)
    img = _simulate_chromatic(img, chroma_shift, chromatic_mode)

    # 3) Perceptual adjustments
    img = _apply_contrast_gamma(img, contrast=contrast, gamma=gamma)

    return img

def simulate_chart_to_base64(**kwargs) -> str:
    """
    Convenience wrapper for views: returns base64-encoded PNG of processed chart.
    """
    out_img = simulate_chart(**kwargs)
    buf = io.BytesIO()
    out_img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")
