from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.urls import reverse
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, MyTokenObtainPairSerializer, TestResultSerializer, UserProfileSerializer, WordSerializer, LeaderboardEntrySerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from .models import CustomUser, TestResult, UserProfile, Word
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.db.models import  F, Window
from django.db.models.functions import RowNumber
from django.utils import timezone
from datetime import timedelta, time
import pytz


class TestProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You have accessed a protected view!"})

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        logout(request)
        return JsonResponse({'detail': 'Successfully logged out'})

class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        token = default_token_generator.make_token(user)
        reset_url = f"http://localhost:3000/password-reset-confirm/{user.id}/{token}"
        
        subject = 'Password Reset Request'
        message = f'''
        You've requested to reset your password. Please use the following link to reset your password:

        {reset_url}

        If you didn't request this, you can safely ignore this email.

        This link will expire in 24 hours.
        '''
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return Response({'detail': 'Password reset email has been sent.'})
        except Exception as e:
            print(f"Error sending email: {e}")  # For debugging
            return Response({'detail': 'Failed to send password reset email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, user_id, token):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get('new_password')
        if not new_password:
            return Response({'detail': 'New password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Password has been reset successfully.'})
    
class TestResultListCreateView(generics.ListCreateAPIView):
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TestResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TestResultDetailView(generics.RetrieveAPIView):
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TestResult.objects.filter(user=self.request.user)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['username'] = request.user.username
        data['date_joined'] = request.user.date_joined
        return Response(data)

# I ill use later when i want to move generate world into backend.
# maybe when i want to add some difficulty like common and advanced words.
# or when i add another langugae word list.
# cause when i add those difficulty it might increase the size of my frontend bundle.
class WordListView(generics.ListAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = [IsAuthenticated]
    
# I ill use later when i want to move generate worl into backend.
class RandomWordView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        word = Word.objects.order_by('?').first()
        if word:
            serializer = WordSerializer(word)
            return Response(serializer.data)
        return Response({'detail': 'No words available.'}, status=status.HTTP_404_NOT_FOUND)
    
class LeaderboardView(APIView):

    def get(self, request):
        time_frame = request.query_params.get('timeFrame', 'day')
        
        # Get the current time in GMT+7
        gmt7 = pytz.timezone('Asia/Bangkok')  # Bangkok/Jakarta is in GMT+7
        now = timezone.now().astimezone(gmt7)

        # Calculate the most recent 6:00 AM
        last_6am = now.replace(hour=6, minute=0, second=0, microsecond=0)
        if now.time() < time(6, 0):
            last_6am -= timedelta(days=1)

        if time_frame == 'day':
            start_date = last_6am
        elif time_frame == 'week':
            # Start from the last 6 AM that was on a Monday
            days_since_monday = (last_6am.weekday() - 0) % 7
            start_date = last_6am - timedelta(days=days_since_monday)
        elif time_frame == 'month':
            # Start from the 1st of the current month at 6 AM
            start_date = last_6am.replace(day=1)
            # If it's before 6 AM and it's the 1st of the month, use last month
            if now.time() < time(6, 0) and now.day == 1:
                start_date -= timedelta(days=1)
                start_date = start_date.replace(day=1)
        elif time_frame == 'all_time':
            start_date = None
        else:
            return Response({"error": "Invalid time frame"}, status=status.HTTP_400_BAD_REQUEST)

        # Main query
        query = TestResult.objects.all()
        if start_date:
            query = query.filter(date_taken__gte=start_date)

        # Annotate with row number partitioned by user, ordered by WPM (desc) and accuracy (desc)
        query = query.annotate(
            row_number=Window(
                expression=RowNumber(),
                partition_by=[F('user')],
                order_by=[F('wpm').desc(), F('accuracy').desc()]
            )
        ).filter(row_number=1)  # Keep only the top result for each user

        # Order the results
        leaderboard_entries = query.values('user__username', 'wpm', 'accuracy', 'date_taken') \
            .order_by('-wpm', '-accuracy', '-date_taken')[:10]

        # Add fixed time (1 minute) to each entry
        for entry in leaderboard_entries:
            entry['time'] = 1  # 1 minute

        serializer = LeaderboardEntrySerializer(leaderboard_entries, many=True)
        return Response(serializer.data)