from django.contrib import admin
from django.urls import path,include
# from djoser.social import urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('accounts.urls')), # Handles JWT creation for login and token refresh
    # path('auth/', include('djoser.social.urls')),
]
 