from rest_framework import serializers
from .models import CustomUser, TestResult, UserProfile, Word
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # custom claims
        token['email'] = user.email
        token['username'] = user.username
        return token

# New serializers for the typing test models

class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = ('id', 'user', 'wpm', 'gross_wpm', 'accuracy', 'correct_characters', 'incorrect_characters', 'passage', 'date_taken')
        read_only_fields = ('user', 'date_taken')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'highest_wpm', 'average_wpm','average_accuracy', 'average_raw_wpm', 'tests_taken')
        read_only_fields = ('user', 'username')

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ('id', 'word')
        
class LeaderboardEntrySerializer(serializers.Serializer):
    username = serializers.CharField(source='user__username')
    wpm = serializers.IntegerField()
    accuracy = serializers.FloatField()
    time = serializers.IntegerField(default=1)  # Default to 1 minute
    date_taken = serializers.DateTimeField()