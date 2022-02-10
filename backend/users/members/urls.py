from django.urls import path
from .views import create_user, login, verification, user_, users_list, forgotpassword, logout, verify_external_user

urlpatterns = [
    path('register/', create_user, name='create'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('verifyexternaluser/',verify_external_user,name='verifyexternaluser'),
    path('verify/<reason>/<uidb64>/<token>',verification, name='verify'),
    path('list/', users_list, name='list'),
    path('<uid>/', user_, name='getuser'),
    path('forgotpassword/',forgotpassword,name='forgotpassword'),
]