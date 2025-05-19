from rest_framework import serializers
from .models import DashboardData

class DashboardDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardData
        fields = ['id', 'created_at', 'updated_at', 'data', 'description']
        read_only_fields = ['id', 'created_at', 'updated_at']
