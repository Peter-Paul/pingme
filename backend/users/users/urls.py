from django.contrib import admin
from django.urls import path,include, re_path
from django.views.generic import TemplateView
from users.custom.tokens import MyTokenObtainPairView,MyTokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('auth/', include('djoser.urls')),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
 