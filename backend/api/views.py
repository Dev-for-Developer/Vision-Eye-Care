import base64
import numpy as np
from django.shortcuts import render
from django.http import JsonResponse
from .optical_simulation import simulate_optical_defocus
from PIL import Image
from io import BytesIO

def upload_image_and_simulate(request):
    """
    Handles image upload, applies optical defocus simulation,
    and returns the simulated image as a Base64 string.
    """
    if request.method == 'POST':
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)

        try:
            # Load image
            uploaded_file = request.FILES['image']
            image = Image.open(uploaded_file).convert("RGB")
            image_np = np.array(image)

            # Get simulation parameters
            refractive_error = float(request.POST.get('refractive_error', 0.0))
            pupil_diameter = float(request.POST.get('pupil_diameter', 4.0))
            wavelength = float(request.POST.get('wavelength', 550))

            # Apply optical simulation
            simulated_image = simulate_optical_defocus(
                image_np,
                refractive_error=refractive_error,
                pupil_diameter=pupil_diameter,
                wavelength=wavelength
            )

            # Convert result to Base64
            simulated_pil = Image.fromarray(simulated_image.astype(np.uint8))
            buffered = BytesIO()
            simulated_pil.save(buffered, format="PNG")
            simulated_base64 = base64.b64encode(buffered.getvalue()).decode()

            return JsonResponse({'simulated_image': simulated_base64})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return render(request, 'upload.html')
