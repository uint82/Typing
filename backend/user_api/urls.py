from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, PasswordResetRequestView, PasswordResetConfirmView, TokenObtainPairView, TestProtectedView,
    TestResultListCreateView, TestResultDetailView, UserProfileView, WordListView, RandomWordView, LeaderboardView
    )
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # authentication endpoint
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<int:user_id>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('test-protected/', TestProtectedView.as_view(), name='protected_view'),
    
    # typing endpoint
    path('test-results/', TestResultListCreateView.as_view(), name='test-result-list'),
    path('test-results/<int:pk>/', TestResultDetailView.as_view(), name='test-result-detail'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('words/', WordListView.as_view(), name='word-list'),
    path('random-word/', RandomWordView.as_view(), name='random-word'),
]