from django.contrib import admin
from django.urls import path
from api import views  # Import from your app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/vision/', views.simulate_vision, name='simulate_vision'),
]
