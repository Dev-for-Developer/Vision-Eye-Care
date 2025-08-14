import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from .optical_simulation import simulate_vision


@csrf_exempt
def vision_simulation_view(request):
    """
    Handle POST request for vision simulation.
    Expects an image and a refractive_error parameter.
    """
    if request.method == "POST":
        try:
            # Validate input
            if 'image' not in request.FILES:
                return JsonResponse({"error": "No image provided"}, status=400)
            
            image_file = request.FILES['image']
            refractive_error = float(request.POST.get("refractive_error", 0.0))

            # Save uploaded file
            image_path = default_storage.save(image_file.name, image_file)
            full_image_path = os.path.join(settings.MEDIA_ROOT, image_path)

            # Run optical simulation
            simulated_img = simulate_vision(full_image_path, refractive_error)

            # Save simulated image
            simulated_path = f"simulated_{image_file.name}"
            simulated_full_path = os.path.join(settings.MEDIA_ROOT, simulated_path)
            simulated_img.save(simulated_full_path)

            return JsonResponse({
                "message": "Simulation completed successfully",
                "simulated_image_url": f"{settings.MEDIA_URL}{simulated_path}"
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
