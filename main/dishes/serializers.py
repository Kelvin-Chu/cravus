from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from cravus.utils import check_img, crop_img
from dishes.models import Dish


class DishSerializer(serializers.ModelSerializer):
    chef = serializers.CharField(source='chef.username', read_only=True)

    class Meta:
        model = Dish
        fields = ('id', 'chef', 'name', 'description', 'cuisine', 'image', 'created_at', 'updated_at')
        read_only_fields = ('id', 'chef', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(DishSerializer, self).get_validation_exclusions()
        return exclusions + ['chef']

    def validate_image(self, image):
        error = 'Unable to read image, try a different image'
        request = self.context.get('request')
        if request and hasattr(request, 'data'):
            if 'crop' in request.data:
                crop = request.data['crop']
                error = check_img(image)
                if not error:
                    crop_image = crop_img(image, crop)
                    if isinstance(crop_image, str):
                        error = crop_image
                    else:
                        return crop_image
        raise ValidationError(error)
