import numpy as np
from scipy.ndimage import gaussian_filter

def simulate_optical_defocus(image_array, refractive_error=0.0, pupil_diameter=4.0, wavelength=550):
    """
    Simulates defocus blur on an image based on optical parameters.
    
    Parameters:
        image_array (numpy.ndarray): Input RGB image as a NumPy array.
        refractive_error (float): Refractive error in diopters (+ for hyperopia, - for myopia).
        pupil_diameter (float): Diameter of the pupil in millimeters.
        wavelength (float): Wavelength of light in nanometers.
        
    Returns:
        numpy.ndarray: Blurred image as NumPy array.
    """
    # Physical constants
    wavelength_m = wavelength * 1e-9  # Convert nm to meters
    pupil_radius_m = (pupil_diameter / 1000) / 2  # Convert mm to meters

    # Calculate defocus blur size (very simplified model)
    # Focal shift proportional to refractive error
    focal_shift = refractive_error * 0.001  # meters
    blur_diameter_m = abs(focal_shift) * (pupil_radius_m / 0.02)  # scaling

    # Convert blur size to pixels
    blur_radius_px = max(1, int(blur_diameter_m * 1e5))  # scale factor

    # Apply Gaussian blur
    blurred_image = np.zeros_like(image_array)
    for i in range(3):  # Apply per RGB channel
        blurred_image[:, :, i] = gaussian_filter(image_array[:, :, i], sigma=blur_radius_px)

    return blurred_image
