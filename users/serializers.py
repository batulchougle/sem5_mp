from rest_framework import serializers
from .models import User, College, Shops, Menu
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


class UserRegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(max_length=68, min_length=6, write_only= True)
    password2=serializers.CharField(max_length=68, min_length=6, write_only= True)
    college_name = serializers.CharField(required=False)   # for canteen person
    college_id = serializers.IntegerField(required=False)  # for student/staff

    class Meta:
        model=User
        fields=['name','username','password','password2','role', 'college_name', 'college_id']

    def validate(self, attrs):
        password=attrs.get('password','')
        password2=attrs.get('password2','')
        username = attrs.get('username')

        errors={}

        if password != password2:
            errors["password"]="Passwords did not match"
            
        if User.objects.filter(username=username).exists():
            errors["username"]= "This username is already taken."
            
        if errors:
            raise serializers.ValidationError(errors)    
        return attrs
        
    def create(self, validated_data):
        role = validated_data.get('role')

        if role == 'canteen_person':
            # create a new college
            college_name = validated_data.pop('college_name')
            college = College.objects.create(
                name=college_name,
                created_by=None  # will assign later after user creation
            )
        elif role == 'student':
            # link to existing college
            college_id = validated_data.pop('college_id')
        
            try:
                college = College.objects.get(id=college_id)
            except College.DoesNotExist:
                raise serializers.ValidationError({"college_id": "Invalid college ID"})
        user=User.objects.create_user(
        name=validated_data.get('name'),
        username=validated_data.get('username'),
        password=validated_data.get('password'),
        role=role,
        college=college

        )

        if role == 'canteen_person':
            college.created_by = user
            college.save()

        return user
    
class LoginSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    password=serializers.CharField(max_length=68,write_only=True)
    name=serializers.CharField(max_length=255,read_only=True)
    username=serializers.CharField(max_length=255,write_only=True)
    access_token=serializers.CharField(max_length=255,read_only=True)
    refresh_token=serializers.CharField(max_length=255,read_only=True)

    class Meta:
        model=User
        fields=['password','name','username','access_token','refresh_token','id']


    def validate(self,attrs):
         username=attrs.get('username') 
         password=attrs.get('password')
         request=self.context.get('request')
         errors={}
         user=authenticate(request,username=username,password=password)
         if not user:
             errors["username"]="Invalid credentials try again"
         if errors:
            raise serializers.ValidationError(errors)    
         user_tokens=user.tokens()

         return {
             'id': user.id,
             'name': user.get_name,
             'username': user.get_username,
              'access_token':str(user_tokens.get('access')),
              'refresh_token':str(user_tokens.get('refresh')),
              'role': user.get_role
            
         }
class LogoutUserSerializer(serializers.Serializer):
    refresh_token=serializers.CharField()

    default_error_messages={
        'bad_token':('token is invalid or has expired')
    }

    def validate(self,attrs):
        self.token=attrs.get('refresh_token')
        return attrs
    
    def save(self,**kwargs):
        try:
          token=RefreshToken(self.token)
          token.blacklist()
          
        except TokenError:
            return self.fail('bad_token')             
    
class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College

        fields = ['id','name']    
class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shops
        fields = ['id','name','image']    

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id','shop','name','image','availability', 'price']                    

        

