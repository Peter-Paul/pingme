from django.urls import path
from .views import listings_,listing_,notifications_,notification_,userlistings_

urlpatterns = [
    path('listings/',listings_,name='listings'),
    path('listing/<lid>/',listing_),
    path('ulisting/<uid>/',userlistings_),
    path('notifications/',notifications_,name='notifications'),
    path('notification/<nid>/',notification_),
]