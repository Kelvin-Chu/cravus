from rest_framework.permissions import BasePermission


class IsChef(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_chef:
            return True
        return False


class IsChefOfDish(BasePermission):
    def has_object_permission(self, request, view, dish):
        if request.user:
            return dish.chef == request.user
        return False
