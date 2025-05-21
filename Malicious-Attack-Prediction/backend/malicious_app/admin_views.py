from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser # Added IsAdminUser
from rest_framework.views import APIView # Added APIView
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from django.db.models import Count # Added for aggregation
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserDisplaySerializer, UserCreateAdminSerializer # Added new serializers


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer

class LoginView(ObtainAuthToken):
    serializer_class = UserLoginSerializer # Use our custom serializer for login

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'email': user.email
        })

class AdminLoginView(ObtainAuthToken):
    serializer_class = UserLoginSerializer # Reuse the same serializer for username/password validation
    permission_classes = (AllowAny,) # Allow any to request login, permission check is within post

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # --- IMPORTANT: Check if the authenticated user is staff/admin ---
        if not user.is_staff: # or user.is_superuser for stricter admin
            return Response(
                {"detail": "You do not have administrative privileges."},
                status=status.HTTP_403_FORBIDDEN # 403 Forbidden
            )

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,       # Explicitly return is_staff for admin panel
            'is_superuser': user.is_superuser, # Also useful for front-end logic
        })

class LogoutView(generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        request.user.auth_token.delete()
        logout(request) # Optional: if you also want to clear session
        return Response(status=status.HTTP_200_OK)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserRegisterSerializer # Reusing for profile display

    def get_object(self):
        return self.request.user

# --- NEW ADMIN-SPECIFIC VIEWS ---

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserDisplaySerializer
    permission_classes = [AllowAny] # Add this line

class UserCreateView(generics.CreateAPIView):
    """
    API endpoint that allows creation of new users by admin.
    Only accessible by staff/admin users.
    """
    queryset = User.objects.all()
    serializer_class = UserCreateAdminSerializer # This serializer needs to be defined in serializers.py
    permission_classes = [IsAuthenticated, IsAdminUser]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows retrieving, updating, or deleting a specific user.
    Only accessible by staff/admin users.
    """
    queryset = User.objects.all()
    serializer_class = UserCreateAdminSerializer # Can reuse or create a specific update serializer in serializers.py
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'pk' # Use primary key to lookup user (e.g., /api/admin/users/1/)

    def perform_destroy(self, instance):
        # Prevent admin from deleting themselves, or last superuser
        if instance == self.request.user:
            raise serializers.ValidationError({"detail": "You cannot delete your own account."})
        if instance.is_superuser and User.objects.filter(is_superuser=True).count() == 1:
             raise serializers.ValidationError({"detail": "Cannot delete the last superuser account."})
        instance.delete()

