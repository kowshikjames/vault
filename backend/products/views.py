from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


from orders.permissions import SupabaseIsAuthenticated
from users.models import SellerProfile

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related('category', 'seller').filter(in_stock=True)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'condition', 'is_featured', 'brand', 'seller__instagram_handle']
    search_fields = ['name', 'brand', 'description', 'tags']
    ordering_fields = ['price', 'created_at']
    ordering = ['is_sold', '-created_at'] # Sold items at the bottom
    lookup_field = 'slug'

    def get_queryset(self):
        qs = super().get_queryset()
        max_price = self.request.query_params.get('max_price')
        if max_price:
            qs = qs.filter(price__lte=max_price)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
        return qs


class SellerProductViewSet(viewsets.ModelViewSet):
    """
    CRUD for a seller's own products.
    """
    serializer_class = ProductSerializer
    permission_classes = [SupabaseIsAuthenticated]

    def get_queryset(self):
        user_id = getattr(self.request, 'supabase_user_id', None)
        if not user_id:
            return Product.objects.none()
        return Product.objects.filter(seller__user_id=user_id)

    def perform_create(self, serializer):
        user_id = getattr(self.request, 'supabase_user_id', None)
        seller = SellerProfile.objects.get(user_id=user_id)
        serializer.save(seller=seller)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
