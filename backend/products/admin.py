from django.contrib import admin
from .models import Product, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'condition', 'in_stock', 'is_featured', 'created_at']
    list_filter = ['category', 'condition', 'in_stock', 'is_featured']
    search_fields = ['name', 'brand', 'description']
    prepopulated_fields = {'slug': ('name',)}
