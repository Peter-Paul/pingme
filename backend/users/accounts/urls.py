from rest_framework import status
from rest_framework.response import Response
from django.urls import path

from rest_framework_simplejwt.exceptions import TokenError,InvalidToken
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from users.settings.base import SIMPLE_JWT

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
           
        # set refresh token in browser with Httponly cookie.
        res = Response(serializer.validated_data['access'], status=status.HTTP_200_OK)
        token = serializer.validated_data['refresh']
        res.set_cookie("token", token, max_age=SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME').total_seconds(),samesite='Lax',secure=False, httponly=True)
        
        return res

class MyTokenRefreshView(TokenRefreshView):
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
                raise InvalidToken(e.args[0])

            return Response(serializer.validated_data['access'],status=status.HTTP_200_OK)
        else:
            # Usually happens when refresh is called before cookie is set
            return Response({"No refresh token passed"},status=status.HTTP_400_BAD_REQUEST)

urlpatterns = [
    path("jwt/create/", MyTokenObtainPairView.as_view(), name="create"),
    path("jwt/refresh/", MyTokenRefreshView.as_view(), name="refresh"),
]