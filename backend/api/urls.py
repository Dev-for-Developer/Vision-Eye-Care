from django.urls import path
from .views import status_view

urlpatterns = [
    path('vision/', status_view),  # This will respond at /api/vision/
]
