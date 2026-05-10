import os
import jwt
from rest_framework.permissions import BasePermission

class SupabaseIsAuthenticated(BasePermission):
    """
    Validates Supabase-issued JWT tokens on protected endpoints.
    Extracts user UUID from token.sub and attaches to request.
    """
    def has_permission(self, request, view):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return False
        token = auth_header.replace('Bearer ', '')
        
        # Load keys from env
        jwt_public_key = os.getenv('SUPABASE_JWT_PUBLIC_KEY', '').replace('\\n', '\n').strip('"')
        service_key = os.getenv('SUPABASE_SERVICE_KEY', '')

        import base64
        try:
            unverified_header = jwt.get_unverified_header(token)
            alg = unverified_header.get('alg', 'HS256')

            
            if alg == 'ES256' and jwt_public_key:
                secret = jwt_public_key
            else:
                try:
                    secret = base64.b64decode(service_key)
                except Exception:
                    secret = service_key
                    
            payload = jwt.decode(
                token,
                secret,
                algorithms=['HS256', 'ES256'],
                options={"verify_aud": False},
                leeway=60
            )
            request.supabase_user_id = payload.get('sub')

            return True
        except jwt.ExpiredSignatureError:

            return False
        except Exception as e:

            return False
