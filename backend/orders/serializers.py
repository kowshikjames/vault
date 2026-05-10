from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_id', 'total', 'status',
            'phone', 'address', 'razorpay_order_id',
            'items', 'created_at'
        ]
        read_only_fields = ['id', 'user_id', 'created_at', 'status']


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating a new order with items."""
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.JSONField(required=False)
    items = serializers.ListField(
        child=serializers.DictField()
    )
