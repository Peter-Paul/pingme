from rest_framework.response import Response
from rest_framework import status
import requests
from rest_framework_simplejwt.authentication import JWTAuthentication



class MyJWTAuth(JWTAuthentication):
    def authenticate(self, request):
        token=request.headers['Authorization'].split(" ")[1]
        res = requests.post(
                            "http://localhost:8000/api/users/verifyexternaluser/",
                            data={"token":token}
                            )
        data=res.json()
        print(data)
        request.user.is_authenticated=True
        return data["member"],data["token"]
        # if res.status_code==200:
        #     # request.user=data["member"]
        #     request.user["is_authenticated"]=True
        #     # print(request.user)
        #     return data["member"],data["token"]
        # else: raise ValueError
