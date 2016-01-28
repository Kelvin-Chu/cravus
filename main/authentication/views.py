from rest_framework import viewsets, status, mixins
from rest_framework.decorators import api_view, detail_route, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from authentication.models import Account, Address
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, AddressSerializer
from rest_framework_jwt.settings import api_settings

from cravus.utils import check_img, crop_img


class AccountViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin, viewsets.GenericViewSet):
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

    # Token gets invalidated if the email is changed, override update method to return the new token after an update
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

    @detail_route(methods=['PUT'], permission_classes=[IsAuthenticated, IsAccountOwner, ])
    @parser_classes((FormParser, MultiPartParser,))
    def image(self, request, *args, **kwargs):
        error = 'Unable to read image, try a different image'
        if 'upload' in request.data and 'crop' in request.data:
            upload = request.data['upload']
            crop = request.data['crop']
            error = check_img(upload)
            if not error:
                crop_image = crop_img(upload, crop)
                if isinstance(crop_image, str):
                    error = crop_image
                else:
                    account = self.get_object()
                    account.avatar.delete()
                    account.avatar.save(upload.name, crop_image)
                    return Response({'upload': [account.avatar.url]}, status=status.HTTP_201_CREATED)
        return Response({'upload': [error]}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_chef(request):
    serializer = AccountSerializer(data=request.data)

    if serializer.is_valid():
        Account.objects.create_chef(**serializer.validated_data)
        return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
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
