from rest_framework import serializers
from dishes.models import Dish
from authentication.serializers import AccountSerializer


class DishSerializer(serializers.ModelSerializer):
    chef = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Dish
        fields = ('id', 'chef', 'name', 'description', 'image', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'image',)

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(DishSerializer, self).get_validation_exclusions()

        return exclusions + ['chef']
