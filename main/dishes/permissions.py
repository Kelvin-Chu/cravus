from rest_framework.permissions import BasePermission


class IsChefOfDish(BasePermission):
    def has_object_permission(self, request, view, dish):
        if request.user:
            return dish.author == request.user
        return False
