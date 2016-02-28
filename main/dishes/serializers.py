from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from cravus.utils import check_img, crop_img
from dishes.models import Dish, DishSchedule


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


class DishScheduleSerializer(serializers.ModelSerializer):
    chef = serializers.CharField(source='chef.username', read_only=True)
    date = serializers.DateField(required=True, input_formats=['%Y-%m-%d'])

    class Meta:
        model = DishSchedule
        fields = ('id', 'chef', 'date', 'dish', 'repeat_daily', 'created_at')
        read_only_fields = ('id', 'chef', 'created_at')

    def create(self, validated_data):
        if validated_data['dish'].chef != validated_data['chef']:
            raise ValidationError("You are not the chef of this dish.")
        if validated_data['repeat_daily']:
            if DishSchedule.objects.filter(dish=validated_data['dish'], repeat_daily=True).exists():
                raise ValidationError("This dish has already been scheduled for daily repeat.")
            else:
                DishSchedule.objects.filter(dish=validated_data['dish']).delete()
        if DishSchedule.objects.filter(chef=validated_data['chef'], date=validated_data['date'],
                                       dish=validated_data['dish']).exists():
            raise ValidationError("This dish has already been scheduled for this date.")
        return super(DishScheduleSerializer, self).create(validated_data)
