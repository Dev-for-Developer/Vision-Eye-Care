from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def status_view(request):
    return JsonResponse({"status": "Backend connected successfully"})
