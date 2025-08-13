from django.urls import path
from . import views

urlpatterns = [
    path('simulate/', views.upload_image_and_simulate, name='upload_image_and_simulate'),
]
