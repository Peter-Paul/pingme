from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view,authentication_classes,permission_classes
from django.urls import re_path

from rest_framework_simplejwt.exceptions import TokenError,InvalidToken
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from users.settings.base import SIMPLE_JWT

rtkn="rtkn" # refresh token name for cookie

def checkForRefresh(cookies):
    mutate = lambda x: x.split("=")
    refresh=[ mutate(x)[1] for x in cookies  if mutate(x)[0]==rtkn]
    if len(refresh)>0: return refresh[0]
    return Response({"No refresh token passed"},status=status.HTTP_400_BAD_REQUEST)

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
        res.set_cookie(rtkn, token, max_age=SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME').total_seconds(),samesite='Lax',secure=False, httponly=True)
        
        return res

class MyTokenRefreshView(TokenRefreshView):
    # we override the post method from TokenViewBase class in child class MyTokenViewBase
    def post(self, request, *args, **kwargs): 
        splitCookies = request.headers['Cookie'].split("; ")
        mutate = lambda x: x.split("=")
        # extract all cookie information to get refresh token NB; the token key must be the same as posted on login
        refresh=[ mutate(x)[1] for x in splitCookies  if mutate(x)[0]==rtkn]
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



@authentication_classes([]) # Empty array because authentication and permission not needed
@permission_classes([]) # Empty array because authentication and permission not needed
@api_view(["GET"])
def logout(request):
    # cookies = request.headers['Cookie'].split("; ")
    # checkForRefresh(cookies)
    res = Response({"message":"Logged out"}, status=status.HTTP_200_OK)
    res.delete_cookie(rtkn)
    return res

urlpatterns = [
    re_path(r"^jwt/create/?", TokenObtainPairView.as_view(), name="jwt-create"),
    re_path(r"^jwt/refresh/?", TokenRefreshView.as_view(), name="jwt-refresh"),
    re_path(r"^jwt/remove/?", logout, name="jwt-refresh", name="jwt-remove"),
]