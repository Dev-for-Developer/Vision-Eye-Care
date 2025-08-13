import numpy as np
from scipy.ndimage import gaussian_filter

def generate_test_image(size=256):
    """
    Generates a simple black & white test image with sharp edges
    for vision simulation.
    """
    img = np.zeros((size, size))
    img[size//4: 3*size//4, size//4: 3*size//4] = 1.0
    return img

def apply_gaussian_blur(image, blur_radius):
    """
    Applies Gaussian blur to simulate vision issues.
    """
    return gaussian_filter(image, sigma=blur_radius)

def simulate_myopia(image_size=256, blur_radius=3):
    """
    Simulate myopia (blurred distant vision) by applying Gaussian blur.
    """
    image = generate_test_image(size=image_size)
    blurred = apply_gaussian_blur(image, blur_radius)
    return blurred.tolist()

def simulate_hypermetropia(image_size=256, blur_radius=1.5):
    """
    Simulate hypermetropia (blurred near vision) by applying Gaussian blur.
    """
    image = generate_test_image(size=image_size)
    blurred = apply_gaussian_blur(image, blur_radius)
    return blurred.tolist()
