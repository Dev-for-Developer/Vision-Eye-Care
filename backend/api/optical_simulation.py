"""
api/optical_simulation.py

Fourier-optics based PSF simulation (wavelength-aware), with simple defocus mapping
(diopters -> wavefront curvature), an elementary astigmatism term (elliptical PSF),
and convolution of an input image with the computed PSF.

This is a first-principles, first-order optical model (Fraunhofer approximation).
It is significantly more realistic than a plain Gaussian blur and is
fast enough for server-side generation with moderate PSF sizes.

Dependencies (install in backend venv):
    pip install numpy scipy pillow
"""

from __future__ import annotations
import os
import io
import base64
from datetime import datetime
from typing import Optional, Dict, Any

import numpy as np
from numpy import pi
from scipy.signal import fftconvolve
from PIL import Image

# -----------------------------
# Helper conversions & physics
# -----------------------------
def wavelength_nm_to_m(lambda_nm: float) -> float:
    return lambda_nm * 1e-9


def diopters_to_focal_length_m(D: float) -> Optional[float]:
    if D == 0:
        return None
    return 1.0 / D


# -----------------------------
# Pupil grid and simple phase
# -----------------------------
def circular_pupil_grid(N: int, pupil_diameter_m: float, grid_extent_m: Optional[float] = None):
    if grid_extent_m is None:
        grid_extent_m = pupil_diameter_m * 2.0
    x = np.linspace(-grid_extent_m / 2.0, grid_extent_m / 2.0, N)
    xv, yv = np.meshgrid(x, x)
    r = np.sqrt(xv**2 + yv**2)
    pupil_mask = (r <= (pupil_diameter_m / 2.0)).astype(float)
    return xv, yv, pupil_mask


def astigmatism_phase(x, y, magnitude_m, axis_deg=0.0, wavelength_m=550e-9):
    theta = np.deg2rad(axis_deg)
    x_rot = x * np.cos(theta) + y * np.sin(theta)
    y_rot = -x * np.sin(theta) + y * np.cos(theta)
    k = 2 * pi / wavelength_m
    # small-magnitude quadratic difference to emulate astigmatism
    phase = k * ( (x_rot**2) - (y_rot**2) ) * (magnitude_m / ( (magnitude_m + 1e-12) ))
    return phase


# -----------------------------
# PSF generation (Fraunhofer)
# -----------------------------
def generate_psf(
    diopters: float = 0.0,
    pupil_diameter_mm: float = 3.0,
    wavelength_nm: float = 550.0,
    astig_mag_m: float = 0.0,
    astig_axis_deg: float = 0.0,
    N: int = 256,
    oversample: int = 2,
):
    pupil_m = pupil_diameter_mm * 1e-3
    wavelength_m = wavelength_nm_to_m(wavelength_nm)

    # grid for pupil function
    grid_N = N * int(max(1, oversample))
    grid_extent = pupil_m * 2.0
    x, y, pupil_mask = circular_pupil_grid(grid_N, pupil_m, grid_extent_m=grid_extent)

    k = 2 * pi / wavelength_m

    # Empirical defocus phase mapping — tuned for reasonable visual effect.
    # This is a practical mapping (not exact optical design). We will refine later.
    if diopters == 0.0:
        phi_defocus = np.zeros_like(x)
    else:
        # scale factor chosen empirically — will be tuned during validation
        alpha = 2e6 * diopters
        phi_defocus = k * (x**2 + y**2) * alpha

    phi_astig = astigmatism_phase(x, y, magnitude_m=astig_mag_m, axis_deg=astig_axis_deg, wavelength_m=wavelength_m)
    total_phase = (phi_defocus + phi_astig) * pupil_mask

    pupil_complex = pupil_mask * np.exp(1j * total_phase)

    E = np.fft.fftshift(np.fft.fft2(np.fft.ifftshift(pupil_complex)))
    PSF = np.abs(E) ** 2
    PSF /= PSF.sum() + 1e-16

    # Downsample PSF if oversampled
    if oversample > 1:
        s = int(oversample)
        PSF_small = PSF.reshape((PSF.shape[0]//s, s, PSF.shape[1]//s, s)).sum(axis=(1,3))
    else:
        PSF_small = PSF

    PSF_small = PSF_small / (PSF_small.sum() + 1e-16)

    pixel_scale_m = grid_extent / PSF.shape[0]
    return PSF_small, pixel_scale_m


# -----------------------------
# Convolution in linear-light
# -----------------------------
def _srgb_to_linear(u: np.ndarray) -> np.ndarray:
    a = 0.055
    mask = (u <= 0.04045)
    lin = np.where(mask, u / 12.92, ((u + a) / (1 + a)) ** 2.4)
    return lin


def _linear_to_srgb(u: np.ndarray) -> np.ndarray:
    a = 0.055
    mask = (u <= 0.0031308)
    srgb = np.where(mask, 12.92 * u, (1 + a) * (u ** (1/2.4)) - a)
    return srgb


def convolve_image_with_psf(pil_image: Image.Image, psf: np.ndarray) -> Image.Image:
    img = pil_image.convert("RGBA")
    arr = np.array(img).astype(np.float32) / 255.0  # sRGB [0..1]

    rgb = arr[..., :3]
    alpha = arr[..., 3:]

    rgb_premult = rgb * alpha

    out_rgb = np.zeros_like(rgb_premult)
    for c in range(3):
        channel = _srgb_to_linear(rgb_premult[..., c])
        conv = fftconvolve(channel, psf, mode='same')
        out_rgb[..., c] = conv

    alpha_chan = alpha[..., 0]
    alpha_safe = np.maximum(alpha_chan, 1e-6)[..., None]
    out_rgb_unpremult = out_rgb / alpha_safe

    out_srgb = _linear_to_srgb(np.clip(out_rgb_unpremult, 0.0, 1.0))

    out_arr = np.dstack([out_srgb, alpha_chan[..., None]])
    out_img = Image.fromarray((np.clip(out_arr, 0.0, 1.0) * 255.0).astype(np.uint8), mode="RGBA")
    return out_img


# -----------------------------
# High-level API
# -----------------------------
def simulate_optical_defocus_image(
    pil_image: Image.Image,
    diopters: float = -2.0,
    pupil_diameter_mm: float = 3.0,
    wavelength_nm: float = 550.0,
    astig_mag_m: float = 0.0,
    astig_axis_deg: float = 0.0,
    psf_N: int = 256,
    oversample: int = 2,
) -> Dict[str, Any]:
    psf, px_scale = generate_psf(
        diopters=diopters,
        pupil_diameter_mm=pupil_diameter_mm,
        wavelength_nm=wavelength_nm,
        astig_mag_m=astig_mag_m,
        astig_axis_deg=astig_axis_deg,
        N=psf_N,
        oversample=oversample,
    )

    out_img = convolve_image_with_psf(pil_image, psf)

    metrics = {
        "psf_sum": float(psf.sum()),
        "psf_peak": float(psf.max()),
        "diopters": float(diopters),
        "pupil_mm": float(pupil_diameter_mm),
        "wavelength_nm": float(wavelength_nm),
        "astig_mag_m": float(astig_mag_m),
        "astig_axis_deg": float(astig_axis_deg),
    }

    return {"psf": psf, "output_image": out_img, "metrics": metrics}


def pil_to_data_url(img: Image.Image, fmt: str = "PNG") -> str:
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode("ascii")
    return f"data:image/{fmt.lower()};base64,{b64}"


def simulate_and_save_image(
    input_image_path: str,
    diopters: float,
    pupil_diameter_mm: float,
    wavelength_nm: float,
    astig_mag_m: float,
    astig_axis_deg: float,
    media_root: str,
    media_url: str,
    psf_N: int = 256,
    oversample: int = 2,
):
    img = Image.open(input_image_path).convert("RGBA")
    res = simulate_optical_defocus_image(
        pil_image=img,
        diopters=diopters,
        pupil_diameter_mm=pupil_diameter_mm,
        wavelength_nm=wavelength_nm,
        astig_mag_m=astig_mag_m,
        astig_axis_deg=astig_axis_deg,
        psf_N=psf_N,
        oversample=oversample,
    )
    out_img: Image.Image = res["output_image"]

    out_dir = os.path.join(media_root, "simulations")
    os.makedirs(out_dir, exist_ok=True)
    fname = f"psf_sim_D{str(diopters).replace('.', '_')}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.png"
    out_path = os.path.join(out_dir, fname)
    out_img.save(out_path, format="PNG")

    image_url = media_url.rstrip("/") + "/simulations/" + fname
    return {"image_url": image_url, "metrics": res["metrics"]}
