from .base import *

DEBUG=False

ALLOWED_HOSTS=["*"]
# ALLOWED_HOSTS=["localhost", "127.0.0.1", "[::1]"]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env("DATABASE_NAME"),
        'USER': env("DATABASE_USER"),
        'PASSWORD': env("DATABASE_PASSWORD"),
        'HOST': env("DATABASE_HOST"),
        'PORT':'3306'
    }
}
