"""
Final api/views.py — ready to use with the optical_simulation above.

Endpoints provided (GET or POST):
 - GET  /api/vision/simulate/?diopters=-2&pupil_mm=3&wavelength=550&astig_mag_m=0&astig_axis_deg=0
 - POST /api/vision/simulate/  JSON body: { "diopters": -2.0, "pupil_mm": 3.0, "wavelength": 550, "astig_mag_m": 0.0, "astig_axis_deg": 0.0 }

Both return:
{
  "status": "success",
  "image_url": "/media/simulations/psf_sim_D-2_....png",
  "metrics": { ... }
}
"""

import os
import json
from django.conf import settings
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt

from .optical_simulation import simulate_and_save_image


def _parse_float(value, default):
    try:
        return float(value)
    except Exception:
        return default


def _chart_default_path() -> str:
    """
    Default place we expect the snellen chart to live in your repo:
    frontend/public/snellenchart.png
    """
    candidate = os.path.join(settings.BASE_DIR, "frontend", "public", "snellenchart.png")
    if os.path.exists(candidate):
        return candidate
    # fallback: try api/snellenchart.png
    local_candidate = os.path.join(os.path.dirname(__file__), "snellenchart.png")
    if os.path.exists(local_candidate):
        return local_candidate
    raise FileNotFoundError(
        "snellenchart.png not found. Please place your chart at frontend/public/snellenchart.png or api/snellenchart.png"
    )


@csrf_exempt
def run_optical_simulation(request: HttpRequest) -> JsonResponse:
    """
    Handles GET and POST for quick testing and frontend integration.
    Returns JSON with saved image URL and metrics.
    """
    try:
        if request.method == "GET":
            params = request.GET
            diopters = _parse_float(params.get("diopters"), -2.0)
            pupil_mm = _parse_float(params.get("pupil_mm"), 3.0)
            wavelength = _parse_float(params.get("wavelength"), 550.0)
            astig_mag_m = _parse_float(params.get("astig_mag_m"), 0.0)
            astig_axis_deg = _parse_float(params.get("astig_axis_deg"), 0.0)
        elif request.method == "POST":
            try:
                data = json.loads(request.body.decode("utf-8") or "{}")
            except Exception:
                data = {}
            diopters = _parse_float(data.get("diopters"), -2.0)
            pupil_mm = _parse_float(data.get("pupil_mm"), 3.0)
            wavelength = _parse_float(data.get("wavelength"), 550.0)
            astig_mag_m = _parse_float(data.get("astig_mag_m"), 0.0)
            astig_axis_deg = _parse_float(data.get("astig_axis_deg"), 0.0)
        else:
            return JsonResponse({"status": "error", "message": "Only GET and POST supported"}, status=405)

        chart_path = _chart_default_path()

        result = simulate_and_save_image(
            input_image_path=chart_path,
            diopters=diopters,
            pupil_diameter_mm=pupil_mm,
            wavelength_nm=wavelength,
            astig_mag_m=astig_mag_m,
            astig_axis_deg=astig_axis_deg,
            media_root=settings.MEDIA_ROOT,
            media_url=settings.MEDIA_URL,
        )

        return JsonResponse({"status": "success", **result})

    except FileNotFoundError as fnf:
        return JsonResponse({"status": "error", "message": str(fnf)}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
