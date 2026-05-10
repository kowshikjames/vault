import uuid
from django.db import models


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField()
    slug = models.TextField(unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    CONDITION_CHOICES = [
        ('mint', 'Mint'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey('users.SellerProfile', on_delete=models.CASCADE, related_name='products', null=True)
    name = models.TextField()
    slug = models.TextField(unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    condition = models.TextField(choices=CONDITION_CHOICES, blank=True, null=True)
    size = models.TextField(blank=True, null=True)
    brand = models.TextField(blank=True, null=True)
    images = models.JSONField(default=list)   # array of Supabase Storage URLs
    tags = models.JSONField(default=list)      # e.g. ['deadstock', 'rare']
    in_stock = models.BooleanField(default=True)
    is_sold = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']

    def __str__(self):
        return self.name
