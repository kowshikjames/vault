from rest_framework import serializers
from .models import SellerProfile

class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['id', 'user_id', 'store_name', 'instagram_handle', 'is_verified', 'created_at']
        read_only_fields = ['id', 'user_id', 'is_verified', 'created_at']
