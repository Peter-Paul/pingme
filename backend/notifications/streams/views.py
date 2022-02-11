from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework.authentication

from .models import Stream, Notifications
from .serializers import StreamSerializer, NotificationsSerializer
from django.core import serializers as ds

def user_is_valid(request,listing):
    user = request.user
    if user == listing.owner:
        return True
    return False

def listing_is_valid(request,notification):
    user = request.user
    listing=Stream.objects.get(id=notification.listing) # checks if the listing for notification belongs to current user
    if user == listing.owner:
        return True
    return False

# LISTINGS
@api_view(['GET','POST'])
def listings_(request):
    data={}
    if request.method == 'GET':
        listings = Stream.objects.all()
        serializer = StreamSerializer(listings, many=True)
        data['data']=serializer.data
        return Response(data,status=status.HTTP_200_OK) 

    if request.method == 'POST':
        payload=request.data
        serializer = StreamSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            data['response']="Successfully posted listing"
            return Response(data,status=status.HTTP_201_CREATED)
        data['error']="Invalid data"
        data['details']=serializer.errors
        return Response(data,status=status.HTTP_400_BAD_REQUEST)

# LISTINGS
@api_view(['GET'])
def userlistings_(request,uid):
    data={}
    if request.method == 'GET':
        listings = Stream.objects.filter(owner=uid)
        serializer = StreamSerializer(listings, many=True)
        data['data']=serializer.data
        # we use django's serializer to serialize the query set
        addNotifs = lambda d:ds.serialize("json",Notifications.objects.filter(listing=d['id'])) 
        data['data']=[ {**d,"notifications":addNotifs(d)} for d in data['data']]
        return Response(data,status=status.HTTP_200_OK) 

@api_view(['GET','PATCH','DELETE'])
def listing_(request,lid):
    data={}
    payload=request.data
    listing = Stream.objects.filter(id=lid)
    isavailable=len(listing)

    if isavailable: listing=listing[0] # if 1 meaning if true
    else: return Response(status=status.HTTP_404_NOT_FOUND)

    if user_is_valid(request,listing):

        if request.method == 'GET':
            serializer = StreamSerializer(listing, many=False)
            data['data']=serializer.data
            return Response(data, status=status.HTTP_200_OK)

        if request.method == 'PATCH':
            serializer = StreamSerializer(listing,data=payload,partial=True)
            if serializer.is_valid():
                serializer.save()
                data['response']="Successfully patched listing"
                return Response(data,status=status.HTTP_201_CREATED)
            data['error']="Invalid data"
            data['details']=serializer.errors
            return Response(data,status=status.HTTP_400_BAD_REQUEST)
        
        if request.method == 'DELETE':
            operation = listing.delete()
            if operation:
                data['response'] = 'Listing deleted'
                return Response(data,status=status.HTTP_200_OK)
            data['error']="Unable to delete"
            return Response(data,status=status.HTTP_400_BAD_REQUEST)

    data['error'] = "You do not have permission to access this info"
    return Response(data, status=status.HTTP_403_FORBIDDEN)
    
# NOTIFICATIONS
@api_view(['GET','POST'])
def notifications_(request):
    data={}
    if request.method == 'GET':
        notifications = Notifications.objects.all()
        serializer = NotificationsSerializer(notifications, many=True)
        data['data']=serializer.data
        return Response(data,status=status.HTTP_200_OK) 

    if request.method == 'POST':
        print(request.data)
        payload=request.data
        serializer = NotificationsSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            data['response']="Successfully posted notification"
            return Response(data,status=status.HTTP_201_CREATED)
        data['error']="Invalid data"
        data['details']=serializer.errors
        return Response(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PATCH','DELETE'])
def notification_(request,nid):
    data={}
    payload=request.data
    notification = Notifications.objects.filter(id=nid)
    isavailable=len(notification)

    if isavailable: notification=notification[0] # if 1 meaning if true
    else: return Response(status=status.HTTP_404_NOT_FOUND)

    if listing_is_valid(request,notification):

        if request.method == 'GET':
            serializer = NotificationsSerializer(notification, many=False)
            data['data']=serializer.data
            return Response(data, status=status.HTTP_200_OK)

        if request.method == 'PATCH':
            serializer = NotificationsSerializer(notification,data=payload,partial=True)
            if serializer.is_valid():
                serializer.save()
                data['response']="Successfully patched notification"
                return Response(data,status=status.HTTP_201_CREATED)
            data['error']="Invalid data"
            data['details']=serializer.errors
            return Response(data,status=status.HTTP_400_BAD_REQUEST)
        
        if request.method == 'DELETE':
            operation = notification.delete()
            if operation:
                data['response'] = 'Notification deleted'
                return Response(data,status=status.HTTP_200_OK)
            data['error']="Unable to delete"
            return Response(data,status=status.HTTP_400_BAD_REQUEST)

    data['error'] = "You do not have permission to access this info"
    return Response(data, status=status.HTTP_403_FORBIDDEN)