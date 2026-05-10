from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from .permissions import SupabaseIsAuthenticated
from products.models import Product


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [SupabaseIsAuthenticated]
    http_method_names = ['get', 'post']

    def get_queryset(self):
        # Scope orders to the requesting user only
        user_id = getattr(self.request, 'supabase_user_id', None)
        if not user_id:
            return Order.objects.none()
        return Order.objects.filter(user_id=user_id).prefetch_related('items__product')

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Build order items and calculate total
        items_data = data.get('items', [])
        total = 0
        order_items = []

        for item in items_data:
            try:
                product = Product.objects.get(id=item['product_id'], in_stock=True)
                qty = int(item.get('quantity', 1))
                price = product.price
                total += price * qty
                order_items.append({'product': product, 'quantity': qty, 'price': price})
            except Product.DoesNotExist:
                return Response(
                    {'error': f"Product {item.get('product_id')} not found or out of stock"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        order = Order.objects.create(
            user_id=request.supabase_user_id,
            total=total,
            phone=data.get('phone', ''),
            address=data.get('address', {}),
        )
        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price=item['price'],
            )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
