from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from authentication.models import Account
from authentication.serializers import AccountSerializer
from authentication.utils import AccountThrottle


class ChefAccountViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    throttle_classes = [AccountThrottle, ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = serializer.save()
        account.is_chef = True
        account.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
