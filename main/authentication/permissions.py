from rest_framework.permissions import BasePermission

from authentication.models import Account


class IsAccountOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Account):
            account = obj
        else:
            account = obj.account
        if hasattr(request, "user"):
            if request.user:
                return account == request.user
        return False
