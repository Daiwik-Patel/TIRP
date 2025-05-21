from django.urls import path
from .views import predict_attack, dashboard_data, list_reports, get_report_data, get_models, UserListView
from .admin_views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    AdminLoginView,
    UserListView,       # New import for admin user listing
    UserCreateView,     # New import for admin user creation
    UserDetailView,     # New import for admin user detail/update/delete
)

urlpatterns = [
    # General User/Public API Endpoints
    path('predict/', predict_attack, name='predict_attack'),
    path('dashboard-data/', dashboard_data, name='dashboard_data'),
    path('reports/', list_reports, name='list_reports'),
    path('reports/<str:filename>', get_report_data, name='get_report_data'),

    # User Authentication Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),   
    path('profile/', UserProfileView.as_view(), name='profile'),

    # --- Admin-Specific Endpoints ---
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('admin/users/', UserListView.as_view(), name='admin_user_list'), # List all users
    path('admin/users/create/', UserCreateView.as_view(), name='admin_user_create'), # Create new user by admin
    path('admin/users/<int:pk>/', UserDetailView.as_view(), name='admin_user_detail'), # Retrieve, update, delete a user
    path('admin/models/', get_models, name='get_models'),
    path('users/', UserListView.as_view(), name='user-list'),
]
