from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from authentication.models import Account, Address
from authentication.utils import trim_mobile
from cravus.utils import check_img, crop_img


def jwt_response_payload_handler(token, user=None, request=None):
    return {'token': token, 'user': AccountSerializer(user).data}


class EmailField(serializers.EmailField):
    # Override the default and send the entire object to to_representation instead of a single field
    def get_attribute(self, obj):
        return obj

    # This method is used to return the value of EmailField when a read request is made
    # Unless the call is by the account owner or an internal call (such as check from login), return null
    def to_representation(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        if obj.is_chef or obj == user or not request:
            return obj.email
        return ""

    # This method is used to return the value of EmailField when a write request is made
    # It is possible to get the entire request dictionary by overwriting the get_value method
    def to_internal_value(self, data):
        validated_data = super(EmailField, self).to_internal_value(data)
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            if Account.objects.exclude(pk=request.user.pk).filter(email=validated_data).exists():
                raise ValidationError("Email used by another user.")
        return validated_data


class MobileField(serializers.CharField):
    def get_attribute(self, obj):
        return obj

    def to_representation(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        if obj.is_chef or obj == user or not request:
            if obj.mobile:
                return obj.mobile[1:]
        return ""

    def to_internal_value(self, data):
        validated_data = super(MobileField, self).to_internal_value(data)
        validated_data = trim_mobile(validated_data)
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            if Account.objects.exclude(pk=request.user.pk).filter(mobile=validated_data).exists():
                raise ValidationError("Mobile used by another user.")
        return validated_data


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    email = EmailField(required=False)  # The email field should only be populated if it's the account owner
    mobile = MobileField(required=False)

    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'mobile', 'avatar', 'password',
                  'confirm_password', 'is_chef']
        read_only_fields = ['id']

    # Overriding default create method to use create_user from account manager instead of going through serializer
    # Otherwise the serializer will store the password in clear by default
    def create(self, validated_data):
        if validated_data.get('is_chef'):
            account = Account.objects.create_chef(**validated_data)
        else:
            account = Account.objects.create_user(**validated_data)
        return account

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.mobile = validated_data.get('mobile', None)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def validate_avatar(self, avatar):
        error = 'Unable to read image, try a different image'
        request = self.context.get('request')
        if request and hasattr(request, 'data'):
            if 'crop' in request.data:
                crop = request.data['crop']
                error = check_img(avatar)
                if not error:
                    crop_image = crop_img(avatar, crop)
                    if isinstance(crop_image, str):
                        error = crop_image
                    else:
                        return crop_image
        raise ValidationError(error)

    def validate_password(self, password):
        request = self.context.get('request')
        if request.method == 'PUT' and hasattr(request, 'data'):
            if 'confirm_password' in request.data:
                if request.data['confirm_password'] == password:
                    return password
        if request.method == 'POST':
            return password
        raise ValidationError('Password confirmation mismatch.')


class AddressSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Address
        fields = ['id', 'account', 'address1', 'address2', 'city', 'state', 'zip']
        read_only_fields = ['id', ]

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(AddressSerializer, self).AddressSerializer()

        return exclusions + ['account']
