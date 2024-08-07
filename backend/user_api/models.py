from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class TestResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='test_results')
    wpm = models.IntegerField()
    gross_wpm = models.FloatField(default=0.0)
    accuracy = models.FloatField()
    correct_characters = models.IntegerField()
    incorrect_characters = models.IntegerField()
    passage = models.TextField()
    date_taken = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.wpm} WPM - {self.date_taken}"

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    highest_wpm = models.IntegerField(default=0)
    average_wpm = models.FloatField(default=0.0)
    average_accuracy = models.FloatField(default=0.0)  
    average_raw_wpm = models.FloatField(default=0.0)  
    tests_taken = models.IntegerField(default=0)

    def __str__(self):
        return f"Profile for {self.user.username}"

class Word(models.Model):
    word = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.word