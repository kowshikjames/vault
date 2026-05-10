from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, CategoryViewSet, SellerProductViewSet
from orders.views import OrderViewSet
from users.views import SellerProfileViewSet

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('seller-products', SellerProductViewSet, basename='seller-product')
router.register('categories', CategoryViewSet, basename='category')
router.register('orders', OrderViewSet, basename='order')
router.register('seller-profiles', SellerProfileViewSet, basename='seller-profile')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
