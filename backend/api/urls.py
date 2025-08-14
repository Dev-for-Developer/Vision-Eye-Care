# backend/api/urls.py
from django.urls import path
from .views import simulate_view

urlpatterns = [
    path("simulate/", simulate_view, name="simulate"),
]
