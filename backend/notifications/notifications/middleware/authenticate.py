from rest_framework.response import Response
from rest_framework import status
import requests

class AuthenticateToken:
    def __init__(self,get_response):
        self.get_response = get_response

    def __call__(self,request):
        authHeader=request.headers['Authorization']
        res = requests.get(
                            "http://localhost:8000/api/users/verifyexternaluser/",
                            headers={'Authorization':authHeader}
                            )
        
        if res.status_code == 200: 
            data = res.json()
            response = self.get_response(request)
            response.user= data["member"]
            return response
        else: 
            return Response({"Error":"Unable to authenticate token"},status=status.HTTP_403_FORBIDDEN)