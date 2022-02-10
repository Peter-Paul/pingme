from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.settings.dev import AUTH_USER_MODEL
from rest_framework.authtoken.models import Token

import uuid


def upload_location(instance, filename):
	file_path = "/".join(["user",str(instance.username),filename]) 
	return file_path

class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            username=username,
        )
        user.is_active = True
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Member(AbstractBaseUser):
    id                      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email 					= models.EmailField(verbose_name="email", max_length=60, unique=True)
    username 				= models.CharField(verbose_name="username",max_length=30, unique=True)
    fullname			    = models.CharField(max_length=30)
    phonenumber			    = models.CharField(max_length=30)
    location			    = models.CharField(max_length=30) # comma string
    membership			    = models.CharField(max_length=30)
    dob			            = models.CharField(max_length=30)
    deleted			        = models.BooleanField(default=False)
    account_complete		= models.BooleanField(default=False)
    isgoogle		        = models.BooleanField(default=False)
    date_joined				= models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login				= models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin				= models.BooleanField(default=False)
    is_active				= models.BooleanField(default=False)
    is_staff				= models.BooleanField(default=False)
    is_superuser			= models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = MyAccountManager()

    def __str__(self):
        return self.email

    # For checking permissions. to keep it simple all admin have ALL permissons
    def has_perm(self, perm, obj=None):
        return self.is_admin

    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    def has_module_perms(self, app_label):
        return True


@receiver(post_save, sender=AUTH_USER_MODEL) # This token is to be used for email verification only
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)