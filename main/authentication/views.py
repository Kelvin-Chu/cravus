from rest_framework import viewsets, status, mixins
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from authentication.models import Account, Address
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, AddressSerializer
from rest_framework_jwt.settings import api_settings


class AccountViewSet(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [AllowAny, ]
        elif self.request.method == 'POST':
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, IsAccountOwner, ]
        return super(AccountViewSet, self).get_permissions()

    def create(self, request, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        super(AccountViewSet, self).update(request, *args, **kwargs)
        account = self.get_object()
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(account)
        token = jwt_encode_handler(payload)
        return Response({
            'token': token,
            'user': AccountSerializer(account).data
        })


@api_view(['POST'])
def create_chef(request):
    serializer = AccountSerializer(data=request.data)

    if serializer.is_valid():
        Account.objects.create_chef(**serializer.validated_data)
        return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     viewsets.GenericViewSet):
    queryset = Address.objects.select_related('account').all()
    serializer_class = AddressSerializer

    def get_permissions(self):
        self.permission_classes = [IsAuthenticated, IsAccountOwner, ]
        return super(AddressViewSet, self).get_permissions()


class AccountAddressViewSet(viewsets.ViewSet):
    queryset = Address.objects.select_related('account').all()
    serializer_class = AddressSerializer

    def list(self, request, account_username=None):
        if request.user.username != account_username:
            return Response([])
        queryset = self.queryset.filter(account__username=account_username).order_by('id')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
