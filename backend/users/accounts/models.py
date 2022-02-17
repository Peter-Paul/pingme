from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid
# from djoser.views import 


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password)
        user.is_active = True
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    id                      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email                   = models.EmailField(max_length=255, unique=True)
    username                = models.CharField(max_length=255)
    location                = models.CharField(max_length=255)
    membership              = models.CharField(max_length=255)
    dob                     = models.CharField(max_length=255)
    is_google               = models.BooleanField(default=False)
    account_complete        = models.BooleanField(default=False)
    is_active               = models.BooleanField(default=False)
    is_staff                = models.BooleanField(default=False)
    date_joined				= models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login				= models.DateTimeField(verbose_name='last login', auto_now=True)
    
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def get_full_name(self):
        return self.first_name

    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email