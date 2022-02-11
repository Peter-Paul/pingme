from .base import *

DEBUG=True
ALLOWED_HOSTS=["*"]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME':'pm_notifications',
        'USER': 'root',
        'PASSWORD': '',
        'HOST':'127.0.0.1',
        'PORT':'3306'
    }
}