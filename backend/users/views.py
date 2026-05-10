from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from orders.permissions import SupabaseIsAuthenticated
from .models import SellerProfile
from .serializers import SellerProfileSerializer

class SellerProfileViewSet(viewsets.ModelViewSet):
    queryset = SellerProfile.objects.all()
    serializer_class = SellerProfileSerializer
    permission_classes = [SupabaseIsAuthenticated]

    def get_queryset(self):
        # Normal GET /seller-profiles/ should ideally be public if we want to show seller info
        return SellerProfile.objects.all()

    @action(detail=False, methods=['get', 'post', 'patch'])
    def me(self, request):
        user_id = getattr(request, 'supabase_user_id', None)
        if not user_id:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            profile = SellerProfile.objects.get(user_id=user_id)
        except SellerProfile.DoesNotExist:
            profile = None

        if request.method == 'GET':
            if not profile:
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        elif request.method == 'POST':
            if profile:
                return Response({'error': 'Profile already exists'}, status=status.HTTP_400_BAD_REQUEST)
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user_id=user_id)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'PATCH':
            if not profile:
                return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
