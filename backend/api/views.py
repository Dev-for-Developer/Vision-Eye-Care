# backend/api/views.py
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .optical_simulation import simulate_chart_to_base64

def _verify_firebase_id_token(request):
  """
  Try to verify Firebase ID token from Authorization header.
  If firebase_admin is not installed/initialized, or no header, return None.
  """
  auth_header = request.headers.get("Authorization", "")
  if not auth_header.startswith("Bearer "):
      return None
  token = auth_header.split(" ", 1)[1].strip()
  try:
      from firebase_admin import auth as fb_auth  # optional dependency
      decoded = fb_auth.verify_id_token(token)
      return decoded  # dict with 'uid', 'email', etc.
  except Exception:
      return None

@csrf_exempt  # using JSON POST from frontend
def simulate_view(request):
    """
    POST JSON body:
      defocus_D, pupil_mm, px_per_mm, chromatic_mode, contrast, gamma
    Returns:
      { "status": "ok", "image_base64": "...", "user": {"uid": "...", "email": "..."}? }
    """
    if request.method != "POST":
        return HttpResponseBadRequest("POST required")

    # optional: identify user (if client sent Firebase token)
    user_info = _verify_firebase_id_token(request)

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
        resp = {"status": "ok", "image_base64": b64}
        if user_info:
            # include a tiny bit of identity in response (useful for debugging/logging)
            resp["user"] = {
                "uid": user_info.get("uid"),
                "email": user_info.get("email"),
            }
        return JsonResponse(resp)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
