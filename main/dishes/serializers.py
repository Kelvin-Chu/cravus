from rest_framework import serializers
from dishes.models import Dish


class DishSerializer(serializers.ModelSerializer):
    chef = serializers.CharField(source='chef.username', read_only=True)

    class Meta:
        model = Dish
        fields = ('id', 'chef', 'name', 'description', 'image', 'created_at', 'updated_at')
        read_only_fields = ('id', 'chef', 'created_at', 'updated_at', 'image',)

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(DishSerializer, self).get_validation_exclusions()
        return exclusions + ['chef']
