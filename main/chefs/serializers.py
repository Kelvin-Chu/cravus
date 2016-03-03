from rest_framework import serializers
from authentication.models import Chef
from dishes.models import Dish


class ChefSerializer(serializers.ModelSerializer):
    account = serializers.CharField(source='account.username', read_only=True)
    dish_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Chef
        fields = (
            'id', 'account', 'tagline', 'bio', 'cuisine', 'type', 'delivery', 'pickup', 'credit', 'background',
            'featured', 'dish_count')
        read_only_fields = ('id', 'account', 'background')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(ChefSerializer, self).get_validation_exclusions()
        return exclusions + ['chef']

    @staticmethod
    def get_dish_count(chef):
        return Dish.objects.select_related("chef").filter(chef=chef.account).count()
