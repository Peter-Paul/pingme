from aifc import Error
from lib2to3.pgen2 import token
from rest_framework.response import Response
from rest_framework import status
import jwt
# from django.conf import SECRET_KEY

class AuthenticateToken:
    def __init__(self,get_response):
        self.get_response = get_response

    def __call__(self,request):
        token=request.headers['Authorization'].split(" ")[1]
        try:
            decode = jwt.decode(token,'django-insecure-^lsgk0m#3_413eq!p02f52&bas1ebj)f2yidze2ftlpfxi=!c+',algorithms=["HS256"])
            request.user.is_active=decode['is_active']
            request.user.user_id=decode['user_id']
            response = self.get_response(request)
            return response
        except jwt.ExpiredSignatureError:
            response = self.get_response(request)
            return Response({"Error":"Unable to authenticate token"},status=status.HTTP_403_FORBIDDEN)
        except jwt.ImmatureSignatureError:
            response = self.get_response(request)
            return Response({"Error":"Unable to authenticate token"},status=status.HTTP_403_FORBIDDEN)
        except jwt.InvalidAlgorithmError:
            response = self.get_response(request)
            return Response({"Error":"Unable to authenticate token"},status=status.HTTP_403_FORBIDDEN)
        except jwt.InvalidSignatureError:
            response = self.get_response(request)
            return Response({"Error":"Unable to authenticate token"},status=status.HTTP_403_FORBIDDEN)