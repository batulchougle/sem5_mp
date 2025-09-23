rom django.urls import path, include
from django.conf import settings
from .views import RegisterUserView, LoginUserView, CollegeListView, ShopCreateView, ShopsListView, MenuCreateView,MenuListView,LogoutUserView
from django.conf.urls.static import static



urlpatterns = [
    
    path('signup/', RegisterUserView.as_view(), name='signup'),
    path('login/',LoginUserView.as_view(), name='login'),
     path('logout/',LogoutUserView.as_view(),name='logout'),
    path('colleges/', CollegeListView.as_view(), name='college-list'),
    path('shops/', ShopCreateView.as_view(), name='shops'),
    path('shops-display/', ShopsListView.as_view(), name='shops-list'),
    path('menu/', MenuCreateView.as_view(), name='menu'),
    path('menu-display/', MenuListView.as_view(), name='menu-list'),
    

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

