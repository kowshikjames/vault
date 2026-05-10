from rest_framework import serializers
from .models import Product, Category


from users.serializers import SellerProfileSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    seller = SellerProfileSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description',
            'price', 'original_price',
            'category', 'category_slug',
            'seller',
            'condition', 'size', 'brand',
            'images', 'tags',
            'in_stock', 'is_sold', 'is_featured',
            'created_at',
        ]
