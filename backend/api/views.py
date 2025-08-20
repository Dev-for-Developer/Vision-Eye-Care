# backend/api/views.py
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .optical_simulation import simulate_chart_to_base64

@csrf_exempt
def simulate_view(request):
    """
    POST JSON with:
      defocus_D (float), pupil_mm (float), px_per_mm (float),
      chromatic_mode ("achromatic"|"chromatic_rgb"),
      contrast (float), gamma (float)

    Returns:
      { "status": "ok", "image_base64": "..." }
    """
    if request.method != "POST":
        return HttpResponseBadRequest("POST required")

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    params = {
        "defocus_D": float(data.get("defocus_D", 0.0)),
        "pupil_mm": float(data.get("pupil_mm", 3.0)),
        "px_per_mm": float(data.get("px_per_mm", 4.0)),
        "chromatic_mode": str(data.get("chromatic_mode", "achromatic")),
        "contrast": float(data.get("contrast", 1.0)),
        "gamma": float(data.get("gamma", 1.0)),
    }

    try:
        b64 = simulate_chart_to_base64(**params)
        return JsonResponse({"status": "ok", "image_base64": b64})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
