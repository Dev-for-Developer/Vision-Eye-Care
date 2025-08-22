import os
import firebase_admin
from firebase_admin import credentials, auth
from django.http import JsonResponse

# Initialize Admin SDK once
if not firebase_admin._apps:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
        "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    })

def verify_firebase_token(request):
    """Return (user_info_dict or None, error_response or None)."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, JsonResponse({"detail": "Missing Bearer token"}, status=401)
    token = auth_header.split(" ", 1)[1].strip()
    try:
        decoded = auth.verify_id_token(token)
        # Useful fields:
        return {
            "uid": decoded.get("uid"),
            "email": decoded.get("email"),
            "name": decoded.get("name"),
            "picture": decoded.get("picture"),
            "email_verified": decoded.get("email_verified"),
        }, None
    except Exception as e:
        return None, JsonResponse({"detail": f"Invalid token: {e}"}, status=401)
