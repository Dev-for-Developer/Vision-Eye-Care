# backend/api/optical_simulation.py
import io
import base64
import numpy as np
from PIL import Image
import cv2

# -----------------------------
# Helpers
# -----------------------------
def _to_numpy_rgb(pil_img: Image.Image) -> np.ndarray:
    if pil_img.mode != "RGB":
        pil_img = pil_img.convert("RGB")
    return np.array(pil_img)

def _to_pil(img_np: np.ndarray) -> Image.Image:
    img_np = np.clip(img_np, 0, 255).astype(np.uint8)
    return Image.fromarray(img_np, mode="RGB")

def _apply_gamma(img_np: np.ndarray, gamma: float) -> np.ndarray:
    if gamma <= 0:
        return img_np
    # Normalize 0..1, power, back to 0..255
    x = np.clip(img_np / 255.0, 0.0, 1.0)
    y = np.power(x, 1.0 / gamma)
    return (y * 255.0)

def _apply_contrast(img_np: np.ndarray, contrast: float) -> np.ndarray:
    # Contrast around 0.5 (127.5). contrast=1 leaves unchanged.
    return np.clip((img_np - 127.5) * contrast + 127.5, 0, 255)

def _gaussian_sigma_pixels(diopters: float, pupil_mm: float, px_per_mm: float) -> float:
    """
    Heuristic mapping from defocus diopters and pupil size to Gaussian sigma in pixels.

    - Larger |D| => more blur.
    - Larger pupil => bigger blur circle.
    """
    # Circle of confusion approx ∝ |D| * pupil_diameter. Sigma ~ coc_diameter / 2.355 (for Gaussian)
    coc_mm = abs(diopters) * max(pupil_mm, 0.1) * 0.6  # 0.6 is a calibration factor
    sigma_px = (coc_mm * px_per_mm) / 2.355
    return float(max(sigma_px, 0.0))

def _blur_channel(ch: np.ndarray, sigma_px: float) -> np.ndarray:
    if sigma_px <= 0.01:
        return ch
    # Kernel size: at least 3 and odd, ~ 6*sigma rule
    k = int(max(3, 2 * int(3 * sigma_px) + 1))
    return cv2.GaussianBlur(ch, (k, k), sigmaX=sigma_px, sigmaY=sigma_px, borderType=cv2.BORDER_REPLICATE)

# -----------------------------
# Main simulation
# -----------------------------
def simulate_retina(
    pil_img: Image.Image,
    diopters: float = 0.0,         # positive = myopic blur for distance targets; negative = hyperopic
    pupil_mm: float = 3.0,         # 2–6 mm typical
    wavelength_nm: int | None = None,  # if None -> trichromatic (R,G,B); else simulate a single λ
    contrast: float = 1.0,         # 0.5–1.2
    gamma: float = 1.0             # 0.7–1.5
) -> Image.Image:
    """
    Physics-inspired defocus blur + simple chromatic model + contrast/gamma shaping.
    """
    img = _to_numpy_rgb(pil_img).astype(np.float32)

    # Estimate pixels-per-mm. If no DPI metadata, assume ~96 dpi (≈ 3.78 px/mm).
    # You can refine this using a known on-screen size or chart scale.
    px_per_mm = 3.78

    # Simple longitudinal chromatic aberration model: effective diopters shift with λ.
    # Anchored near photopic peak ~555nm. About ~0.3D across ~100 nm is a reasonable ballpark.
    def effective_diopters_for_lambda(D, lam_nm):
        if lam_nm is None:
            return D
        delta = (555.0 - float(lam_nm)) * 0.003  # 100 nm => ~0.3D shift
        return D + delta

    if wavelength_nm is None:
        # Trichromatic: simulate R,G,B with slightly different effective diopters
        # Representative wavelengths for display primaries (approx):
        wl = {"R": 610, "G": 555, "B": 470}
        channels = cv2.split(img)  # B, G, R order in OpenCV
        Bc, Gc, Rc = channels

        # Compute sigma per channel
        D_R = effective_diopters_for_lambda(diopters, wl["R"])
        D_G = effective_diopters_for_lambda(diopters, wl["G"])
        D_B = effective_diopters_for_lambda(diopters, wl["B"])

        sig_R = _gaussian_sigma_pixels(D_R, pupil_mm, px_per_mm)
        sig_G = _gaussian_sigma_pixels(D_G, pupil_mm, px_per_mm)
        sig_B = _gaussian_sigma_pixels(D_B, pupil_mm, px_per_mm)

        Rb = _blur_channel(Rc, sig_R)
        Gb = _blur_channel(Gc, sig_G)
        Bb = _blur_channel(Bc, sig_B)

        img_blur = cv2.merge([Bb, Gb, Rb]).astype(np.float32)
    else:
        # Single wavelength: same blur applied to all channels (monochromatic blur)
        D_eff = effective_diopters_for_lambda(diopters, wavelength_nm)
        sigma_px = _gaussian_sigma_pixels(D_eff, pupil_mm, px_per_mm)
        Bc, Gc, Rc = cv2.split(img)
        Rb = _blur_channel(Rc, sigma_px)
        Gb = _blur_channel(Gc, sigma_px)
        Bb = _blur_channel(Bc, sigma_px)
        img_blur = cv2.merge([Bb, Gb, Rb]).astype(np.float32)

    # Perceptual shaping
    img_contrast = _apply_contrast(img_blur, float(contrast))
    img_gamma = _apply_gamma(img_contrast, float(gamma))

    return _to_pil(img_gamma)

def pil_to_base64_png(pil_img: Image.Image) -> str:
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"
