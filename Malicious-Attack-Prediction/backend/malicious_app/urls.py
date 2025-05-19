from django.urls import path
from .views import predict_attack

urlpatterns = [
    path('predict/', predict_attack, name='predict_attack'),
    
]
