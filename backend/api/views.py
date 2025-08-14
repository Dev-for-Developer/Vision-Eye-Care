# backend/api/views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpRequest
from PIL import Image
import json

from .optical_simulation import simulate_retina, pil_to_base64_png

@csrf_exempt
def simulate_view(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    # Expect multipart/form-data with 'image' and optional numeric fields
    img_file = request.FILES.get("image")
    if not img_file:
        return JsonResponse({"error": "image file is required"}, status=400)

    # Parse numeric params (fallbacks if missing)
    diopters = float(request.POST.get("diopters", "0"))
    pupil_mm = float(request.POST.get("pupil_mm", "3"))
    contrast = float(request.POST.get("contrast", "1.0"))
    gamma = float(request.POST.get("gamma", "1.0"))

    wavelength_nm_raw = request.POST.get("wavelength_nm")
    wavelength_nm = int(wavelength_nm_raw) if wavelength_nm_raw and wavelength_nm_raw.lower() != "none" else None

    try:
        pil_img = Image.open(img_file)
        out_img = simulate_retina(
            pil_img=pil_img,
            diopters=diopters,
            pupil_mm=pupil_mm,
            wavelength_nm=wavelength_nm,
            contrast=contrast,
            gamma=gamma,
        )
        data_url = pil_to_base64_png(out_img)
        return JsonResponse({"image": data_url}, status=200)
    except Exception as e:
        return JsonResponse({"error": f"{type(e).__name__}: {e}"}, status=500)
