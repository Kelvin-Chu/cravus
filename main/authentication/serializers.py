from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from authentication.models import Account, Address
from django.core.validators import validate_email


class EmailField(serializers.Field):
    def get_attribute(self, obj):
        # Override the default and send the entire object to to_representation instead of a single field
        return obj

    def to_representation(self, obj):
        # This method is used to return the value of EmailField when a read request is made
        # Unless the call is by the account owner or an internal call (such as check from login), return null
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        if obj == user or not request:
            return obj.email
        return ""

    def to_internal_value(self, email):
        # This method is used to return the value of EmailField when a write request is made
        # It is possible to get the entire request dictionary by overwriting the get_value method
        validate_email(email)
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            if Account.objects.exclude(pk=request.user.pk).filter(email=email).exists():
                raise ValidationError("Email used by another user.")
        return email


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    email = EmailField()  # The email field should only be populated if it's the account owner

    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'created_at', 'updated_at', 'first_name', 'last_name', 'avatar',
                  'password', 'confirm_password', 'is_chef']
        read_only_fields = ['id', 'created_at', 'updated_at', 'avatar', 'is_chef']

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and confirm_password and password == confirm_password:
            instance.set_password(password)
            instance.save()

        return instance


class AddressSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Address
        fields = ['id', 'account', 'address1', 'address2', 'city', 'state', 'zip']
        read_only_fields = ['id', ]

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(AddressSerializer, self).AddressSerializer()

        return exclusions + ['account']
