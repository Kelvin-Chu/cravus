import json
import hashlib
import base64
import hmac
import time
from django.conf import settings
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import api_view, detail_route, parser_classes, throttle_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.permissions import AllowAny, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from authentication.models import Account, Address
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, AddressSerializer
from rest_framework_jwt.settings import api_settings
from cravus.utils import check_img, crop_img
from .utils import AccountThrottle


class AccountViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin, viewsets.GenericViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    throttle_classes = [AccountThrottle, ]

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
    def image(self, request, username):
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


class ChefAccountViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    throttle_classes = [AccountThrottle, ]

    def perform_create(self, serializer):
        serializer.save(is_chef=True)


class AddressViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    lookup_field = 'account__username'
    queryset = Address.objects.select_related('account').all()
    serializer_class = AddressSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, IsAccountOwner, ]
        return super(AddressViewSet, self).get_permissions()

    def retrieve(self, request, *args, **kwargs):
        target = kwargs.get('account__username', None)
        if request.user.username != target:
            try:
                account = Account.objects.get(username=target)
                if account.is_chef:
                    address = self.queryset.get(account__username=target)
                    return Response({'city': address.city, 'state': address.state})
            except Exception:
                return Response({})
        serializer = self.serializer_class(self.get_object())
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def disqus(request):
    secret = getattr(settings, 'DISQUS_SECRET_KEY', None)
    public = getattr(settings, 'DISQUS_PUBLIC_KEY', None)
    if not secret or not public:
        Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    data = json.dumps({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
    })
    timestamp = int(time.time())
    message = base64.b64encode(bytes(data, 'ascii'))
    body = bytes('%s %s' % (message.decode(), timestamp), 'ascii')
    sig = hmac.HMAC(bytes(secret, 'ascii'), body, hashlib.sha1).hexdigest()
    payload = message.decode() + " " + sig + " " + str(timestamp)
    return Response({'payload': payload, 'public_key': public})
