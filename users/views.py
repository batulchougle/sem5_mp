from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .models import College, Shops, Menu
from .serializers import UserRegisterSerializer, LoginSerializer,CollegeSerializer, ShopSerializer, MenuSerializer
from rest_framework.response import Response
from rest_framework import status,  generics, permissions
from rest_framework import serializers
from .permissions import IsCanteenPerson
from rest_framework.exceptions import PermissionDenied



class RegisterUserView(GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(
                data=request.data, context={'request': request}
            )
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CollegeListView (generics.ListCreateAPIView):
        queryset = College.objects.all()

        serializer_class = CollegeSerializer

class ShopCreateView(generics.ListCreateAPIView):
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated, IsCanteenPerson]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "canteen_person":
            return Response({"error": "Only canteen persons can add shops."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer.save(college=user.college)   

class ShopsListView (generics.ListCreateAPIView):
        
        serializer_class = ShopSerializer
        permission_classes = [permissions.IsAuthenticated]
        def get_queryset(self):
            user=self.request.user
            return Shops.objects.filter(college=self.request.user.college)
 
    
        def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)


class MenuCreateView(generics.ListCreateAPIView):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAuthenticated, IsCanteenPerson]

    def get_queryset(self):
        user = self.request.user
        
        return Menu.objects.filter(shop__college=user.college)

    def perform_create(self, serializer):
        user = self.request.user


        shop = serializer.validated_data.get("shop")
        if not shop:
            raise PermissionDenied("Shop must be provided.")
        if shop.college != user.college:
            raise PermissionDenied("You can only add menu items to shops of your college.")

        serializer.save()  


class MenuListView(generics.ListAPIView):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        shop_id = self.request.query_params.get('shop_id')  # frontend sends shop ID as query para

        if not shop_id:
            return Menu.objects.none()  

        try:
            shop = Shops.objects.get(id=shop_id, college=user.college)
        except Shops.DoesNotExist:
            return Menu.objects.none()  

        
        return Menu.objects.filter(shop=shop)
