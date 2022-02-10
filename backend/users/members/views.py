from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from rest_framework.response import Response
from rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import MemberSerializer, MemberGetSerializer, ChangePasswordSerializer
from .models import Member
from users.settings.dev import EMAIL_HOST_USER
from django.core import serializers as ds


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        # token['id'] = str(user.id)
        token['username'] = user.username
        return token

# CREATES JWT TOKENS
def get_tokens_for_user(user):
    serialtoken = MyTokenObtainPairSerializer.get_token(user)
    tokens = {
        'refresh': str(serialtoken),
        'access': str(serialtoken.access_token),
    }
    return tokens

# USER REGISTRATION
def notPresent(username,email):
    absent = len(Member.objects.filter(username=username))+len(Member.objects.filter(email=email))
    # absent must be 0 which equals to False meaning no user with these credentials exsists
    if absent: return True  
    else: return False

#EMAIL VERIFICATION
def send_verification_email(request,account,subject,reason,message,button):
    email_subject = subject
    current_site = get_current_site(request).domain
    link = reverse('verify', kwargs={
        'reason':reason,
        'uidb64':urlsafe_base64_encode(force_bytes(account.id)),
        'token':Token.objects.get(user=account).key
    })
    activation_link = 'http://'+current_site+link
    email_body = """\
        <html>
        <head></head>
        <body>
            <p>%s</p>
            <form action='%s'>
                <button type='submit'>%s</button>
            </form>
        </body>
        </html>
        """ % (message,activation_link,button)
    
    email = EmailMessage(
        email_subject,
        email_body,
        EMAIL_HOST_USER,
        [account.email],
    )
    email.content_subtype = "html" # this is the crucial part 
    # email.send(fail_silently=False) # sends the email

@api_view(['POST'])
@authentication_classes([]) # Empty array because authentication and permission not needed
@permission_classes([]) # Empty array because authentication and permission not needed
def create_user(request):
    data = {}
    payload=request.data
    serializer = MemberSerializer(data=payload)
    if serializer.is_valid():
        
        email = payload.get('email') # removed lower() cause emails can have capital letters
        username = payload.get('username')

        if notPresent(username,email) == False:
            data['error'] = 'Email or Username is already in use.'
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        account = serializer.save()

        # EMAIL FOR VERIFICATION IF USER DIDN'T USE GOOGLE LINK
        isgoogle = payload.get("isgoogle")

        data['response'] = 'successfully registered new user.'
        if not isgoogle:
            e_subject='Kindly Activate Your PingMe Account'
            e_message='Please click the button below to verify your email address'
            e_reason='activate'
            e_button='Activate Account'
            send_verification_email(request,account,e_subject,e_reason,e_message,e_button)
            data['next'] = 'wait'
        else:
            token = get_tokens_for_user(account)
            data['token']=token
            data['next'] = 'login'
            # respond to login with google
        return Response(data,status=status.HTTP_201_CREATED)

    else:
        data['error']="Invalid signup credentials"
        data['details'] = serializer.errors
        return Response(data,status=status.HTTP_400_BAD_REQUEST)

# USER EMAIL VERIFICATION
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def verification(request,reason,uidb64, token):
    data = {}
    uid = force_str(urlsafe_base64_decode(uidb64))
    user=Member.objects.filter(id=uid)
    isavailable = len(user)
    if isavailable: # if 1 meaning if true
        user=user[0]
        if reason == "activate":
            if user.is_active:
                data['response']="User already activated"
                # redirect to login page
                return  Response(data,status=status.HTTP_208_ALREADY_REPORTED) # use status on frontend to handle request and send to login

            user.is_active = True
            user.save()
            data['response'] = 'Account activated successfully'
            # redirect to login page
            return Response(data,status=status.HTTP_200_OK) 
        elif reason == "reset":
            data['response'] = 'Reset initiated successfully'
            # redirect to change password for forgot password page
            return Response(data,status=status.HTTP_200_OK)
    else:
        data['error'] = "Invalid Link"
        return Response(data,status=status.HTTP_400_BAD_REQUEST)

# USER LOGIN
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login(request):
    print(request.META["HTTP_HOST"])
    data = {}
    username = request.data['email']
    password = request.data['password']
    account = authenticate(username=username, password=password)

    if account:
        if account.is_active:
            token = get_tokens_for_user(account)
            data['response'] = 'Sucessfully logged in'
            data['token'] = token
            response = Response()
            response.set_cookie(key="token",value=token["refresh"],httponly=True)
            response.data=data
            # response.status_code(200)
            return response
        else:
            data['error'] = 'Inactive User'
            return Response(data,status=status.HTTP_400_BAD_REQUEST)
    else:
        data['error'] = 'Invalid credentials or check your email to activate account'
        return Response(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def forgotpassword(request):
    data={}
    payload=request.data
    account=Member.objects.filter(email=payload['email']) # must be email dict
    isavailable=len(account)==1

    if isavailable:
        e_subject='Reset Your PingMe Account Password'
        e_message='Please click the button below to reset your PingMe account password'
        e_reason='reset'
        e_button='Reset Password'
        send_verification_email(request,account[0],e_subject,e_reason,e_message,e_button)

        data['response'] = 'successfully found user'
        return Response(data,status=status.HTTP_200_OK)

    data['error'] = 'User with this email not found'
    return Response(data, status=status.HTTP_400_BAD_REQUEST)

# THE REST OF THE CRUD OPERATIONS
# GETS ALL MEMBERS 
@api_view(['GET']) # Has both authentication and permission by default
def users_list(request):
    data={}
    user=Member.objects.get(email=request.user)
    if user.is_admin: # only admin can access all users
        users = Member.objects.all()
        serializer = MemberGetSerializer(users, many=True)
        data['data']=serializer.data
        return Response(data,status=status.HTTP_200_OK)
    else:
        data['error']="You do not have permission to access this info"
        return Response(data,status=status.HTTP_403_FORBIDDEN)

# PERFORMS CRUD OPERATIONS ON INDIVIDUAL USERS
@api_view(['GET','PATCH','DELETE'])
def user_(request,uid):
   
    data={}
    account = Member.objects.filter(id=uid)
    isavailable=len(account)

    if isavailable: account=account[0] # if 1 meaning if true
    else: return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if str(user) != account.email: # 
        data['error'] = "You do not have permission to access this info"
        return Response(data, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = MemberGetSerializer(account)
        data['data'] = serializer.data
        return Response(data,status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        operation = account.delete()
        if operation:
            data['response'] = 'Account deleted'
            return Response(data,status=status.HTTP_200_OK)
        data['error']="Unable to delete"
        return Response(data,status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PATCH':
        try:
            instruction=request.data["instruction"]
            payload=request.data["payload"]

            if instruction == "patchUser":
                serializer = MemberGetSerializer(account,data=payload,partial=True)
                if serializer.is_valid():
                    serializer.save()
                    data['response']='Patch Successful'
                    return Response(data,status=status.HTTP_200_OK)
                data['error']="Invalid patch request"
                data['detail']=serializer.errors
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            elif instruction == "patchPassword":
                serializer = ChangePasswordSerializer(data=payload, partial=False) # all feilds must be provided
                if serializer.is_valid():
                    # check old password
                    if not account.check_password(serializer.data.get('old_password')):
                        data['error']="Wrong old password"
                        return Response(data,status=status.HTTP_400_BAD_REQUEST)

                    # confirm new passwords match
                    new_password = serializer.data.get("new_password")
                    confirm_new_password = serializer.data.get("confirm_new_password")

                    if new_password != confirm_new_password:
                        data['error']="New passwords must match"
                        return Response(data, status=status.HTTP_400_BAD_REQUEST)

                    account.set_password(new_password)
                    account.save()
                    data['response']="Successfully changed password"
                    return Response(data, status=status.HTTP_200_OK)

                data['error']="Provide all change password requirements"
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            elif instruction == "forgotPassword":
                serializer = ChangePasswordSerializer(data=payload, partial=True) # all feilds must be provided
                if serializer.is_valid():
                    # confirm new passwords match
                    new_password = serializer.data.get("new_password")
                    confirm_new_password = serializer.data.get("confirm_new_password")

                    if new_password != confirm_new_password:
                        data['error']="New passwords must match"
                        return Response(data, status=status.HTTP_400_BAD_REQUEST)

                    account.set_password(new_password)
                    account.save()
                    data['response']="Successfully changed password"
                    return Response(data, status=status.HTTP_200_OK)

                data['error']="Provide all forgot password requirements"
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            
            else:
                data['error']="Invalid instruction"
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
        except KeyError:
                data['error']="Patch requires payload and instruction"
                return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST']) # no need to authenticate since no data is being accessed
@authentication_classes([])
@permission_classes([])
def logout(request):
    response = Response()
    response.delete_cookie(key="token")
    return response

class MyJWTAuth(JWTAuthentication):
    def authenticate(self, payload):
        validated_token = self.get_validated_token(payload["token"])
        return self.get_user(validated_token), validated_token
        

# @authentication_classes([])
# @permission_classes([])
@api_view(['GET'])
def verify_external_user(request):
    data={}
    serializer = MemberGetSerializer(request.user)
    data['member']=serializer.data
    return Response(data,status=status.HTTP_200_OK)
    # data={}
    # payload=request.data # external request
    # auth=MyJWTAuth()
    # res=auth.authenticate(payload)
    # (member,token) =res
    # serializer = MemberGetSerializer(member)
    # data["member"]=serializer.data
    # return Response(data,status=status.HTTP_200_OK)
