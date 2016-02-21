from rest_framework import serializers
from authentication.models import Chef


class ChefSerializer(serializers.ModelSerializer):
    account = serializers.CharField(source='account.username', read_only=True)

    class Meta:
        model = Chef
        fields = ('id', 'account', 'tagline', 'bio', 'cuisine', 'type', 'delivery', 'pickup', 'credit')
        read_only_fields = ('id', 'account',)

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(ChefSerializer, self).get_validation_exclusions()
        return exclusions + ['chef']
