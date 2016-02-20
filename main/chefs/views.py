from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, AllowAny
from authentication.models import Chef
from authentication.permissions import IsAccountOwner
from chefs.serializers import ChefSerializer


class ChefViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    lookup_field = 'account__username'
    queryset = Chef.objects.select_related('account').all()
    serializer_class = ChefSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, IsAccountOwner, ]
        return super(ChefViewSet, self).get_permissions()
