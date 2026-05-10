import uuid
from django.db import models

class SellerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(unique=True, help_text="Supabase Auth UUID")
    store_name = models.CharField(max_length=255)
    instagram_handle = models.CharField(max_length=255)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'seller_profiles'

    def __str__(self):
        return self.store_name
