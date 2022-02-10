from tokenize import TokenError
from jwt import InvalidTokenError
from rest_framework import status
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenViewBase
)
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

class MyTokenViewBase(TokenViewBase):
    # we override the post method from TokenViewBase class in child class MyTokenViewBase
    def post(self, request, *args, **kwargs): 
        splitCookies = request.headers['Cookie'].split("; ")
        mutate = lambda x: x.split("=")
        # extract all cookie information to get refresh token NB; the token key must be the same as posted on login
        refresh=[ mutate(x)[1] for x in splitCookies  if mutate(x)[0]=="token"]
        if len(refresh)>0: 
            token={"refresh":refresh[0]}
            serializer = self.get_serializer(data=token)
            try:
                serializer.is_valid(raise_exception=True)
            except TokenError as e:
                raise InvalidTokenError(e.args[0])

            return Response(serializer.validated_data,status=status.HTTP_200_OK)
        else:
            # Usually happens when refresh is called before cookie is set
            return Response({"No refresh token passed"},status=status.HTTP_400_BAD_REQUEST)

class MyTokenRefreshView(MyTokenViewBase):
    serializer_class = TokenRefreshSerializer


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/users/', include('members.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
]

