from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import UserManager
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.translation import gettext_lazy as _

class User(AbstractBaseUser,PermissionsMixin):
    id = models.BigAutoField(primary_key=True, editable=False) 
    name=models.CharField(max_length=255, verbose_name=_("Name"))
    username=models.CharField(max_length=100,unique=True, verbose_name=_("Username"))
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('canteen_person', 'Canteen Person'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    college = models.ForeignKey('College', on_delete=models.CASCADE, null=True, blank=True)
    
    USERNAME_FIELD = "username" 
    REQUIRED_FIELDS=["name","role"]

    objects=UserManager()

    def __str__(self):
        return (self.id)
    @property
    def get_name(self):
        return (self.name)
    @property
    def get_username(self): 
        return (self.username)
    @property
    def get_role(self):
        return (self.role)
    
    def tokens(self):
        refresh=RefreshToken.for_user(self)
        return {
            'refresh':str(refresh),
            'access':str(refresh.access_token)

        }

class College(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_colleges',null=True, blank=True)

    def __str__(self):

        return self.name
class Shops(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False) 
    college = models.ForeignKey('College', on_delete=models.CASCADE, null=True, blank=True)
    name=models.CharField(max_length=255, verbose_name=_("Name"))
    image=models.ImageField(upload_to='shops_images/',null=True,blank=True)
    def __str__(self):
        return (self.name)    

class Menu(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False) 
    shop = models.ForeignKey('Shops', on_delete=models.CASCADE, null=True, blank=True)
    name=models.CharField(max_length=255, verbose_name=_("Name"))
    image=models.ImageField(upload_to='menu_images/',null=True,blank=True)
    availability = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    def __str__(self):
        return (self.name)        
