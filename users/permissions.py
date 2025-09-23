from rest_framework.permissions import BasePermission

class IsCanteenPerson(BasePermission):
    """
    Allow access only to users with role 'canteen_person'
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "canteen_person")
