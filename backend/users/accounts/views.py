from django.shortcuts import render

# Create your views here.
def signupverify(request):
    return render(request, "accounts/activate_user.html")