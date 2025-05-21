from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate # Import authenticate
from .models import MLModel

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Token.objects.create(user=user) # Create a token for the new user
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")

        # Authenticate the user
        user = authenticate(request=self.context.get('request'),
                            username=username,
                            password=password)

        if not user:
            raise serializers.ValidationError("Unable to log in with provided credentials.")

        # If authentication is successful, add the user object to validated_data
        data['user'] = user
        return data

# --- NEW ADMIN-SPECIFIC SERIALIZERS FOR USER MANAGEMENT ---

class UserDisplaySerializer(serializers.ModelSerializer):
    """
    Serializer for displaying user information in the admin panel (read-only for listing).
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']

class UserCreateAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating users by an admin.
    Allows setting is_staff and is_superuser, and optionally changing password.
    """
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'}) # Password can be optional for updates

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff', 'is_superuser']
        read_only_fields = ['id'] # ID is read-only when creating/updating

    def create(self, validated_data):
        password = validated_data.pop('password', None) # Pop password for create_user
        user = User.objects.create_user(**validated_data) # Use create_user to handle password hashing
        if password:
            user.set_password(password) # Set password if provided
            user.save()
        return user

    def update(self, instance, validated_data):
        # Update user fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)

        # Handle password change
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
        return instance

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = '__all__'

