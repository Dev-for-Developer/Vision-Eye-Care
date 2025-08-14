import numpy as np
from scipy.ndimage import gaussian_filter
from PIL import Image


def apply_gaussian_blur(image_array, sigma):
    """
    Apply Gaussian blur to simulate optical defocus.
    """
    return gaussian_filter(image_array, sigma=(sigma, sigma, 0))


def simulate_vision(image_path, refractive_error=0.0):
    """
    Simulate how vision would appear given a refractive error.
    Positive values simulate hypermetropia (farsightedness).
    Negative values simulate myopia (nearsightedness).
    """
    try:
        # Load image
        img = Image.open(image_path).convert("RGB")
        img_array = np.array(img)

        # Determine blur based on refractive error
        # You can later replace this mapping with wavelength-aware PSF or ray tracing
        sigma = abs(refractive_error) * 2.0  # scaling factor for blur
        simulated_array = apply_gaussian_blur(img_array, sigma)

        # Convert back to image
        simulated_img = Image.fromarray(np.uint8(simulated_array))
        return simulated_img

    except Exception as e:
        raise RuntimeError(f"Error simulating vision: {str(e)}")
