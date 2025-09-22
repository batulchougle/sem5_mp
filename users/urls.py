from django.urls import path, include
from django.conf import settings
from .views import RegisterUserView, LoginUserView, CollegeListView



urlpatterns = [
    
    path('signup/', RegisterUserView.as_view(), name='signup'),
    path('login/',LoginUserView.as_view(), name='login'),
     path('colleges/', CollegeListView.as_view(), name='college-list'),
]