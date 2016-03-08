import datetime

from django.conf import settings
from taggit_serializer.serializers import TagListSerializerField, TaggitSerializer
from drf_haystack.serializers import HaystackSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from cravus.utils import check_img, crop_img
from dishes.models import Dish, DishSchedule
from dishes.search_indexes import DishScheduleIndex


class ImageField(serializers.ImageField):
    def to_representation(self, obj):
        img = super(ImageField, self).to_representation(obj)
        if not img:
            img = getattr(settings, 'DEFAULT_DISH_IMAGE', None)
        return img


class DishSerializer(TaggitSerializer, serializers.ModelSerializer):
    dish = serializers.IntegerField(source='id', read_only=True, required=False)
    chef = serializers.CharField(source='chef.username', read_only=True)
    image = ImageField(required=False)
    thumbnail = ImageField(required=False)
    ingredients = TagListSerializerField(required=False)

    class Meta:
        model = Dish
        fields = (
            'id', 'dish', 'chef', 'name', 'description', 'cuisine', 'price', 'image', 'thumbnail', 'ingredients',
            'created_at',
            'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

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
    thumbnail = ImageField(source='dish.thumbnail', read_only=True, required=False)
    description = serializers.CharField(source='dish.description', read_only=True)
    name = serializers.CharField(source='dish.name', read_only=True)
    date = serializers.DateField(required=True, input_formats=['%Y-%m-%d'])

    class Meta:
        model = DishSchedule
        fields = ('id', 'chef', 'date', 'dish', 'thumbnail', 'description', 'name', 'repeat_daily', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        if validated_data['dish'].chef != validated_data['chef']:
            raise ValidationError("You are not the chef of this dish.")
        if validated_data['repeat_daily']:
            if DishSchedule.objects.filter(dish=validated_data['dish'], repeat_daily=True).exists():
                raise ValidationError("This dish has already been scheduled for daily repeat.")
            else:
                validated_data['date'] = datetime.datetime.strptime('2001-01-01', "%Y-%m-%d").date()
                DishSchedule.objects.filter(dish=validated_data['dish']).delete()
        if DishSchedule.objects.filter(chef=validated_data['chef'], date=validated_data['date'],
                                       dish=validated_data['dish']).exists():
            raise ValidationError("This dish has already been scheduled for this date.")
        return super(DishScheduleSerializer, self).create(validated_data)


class DishSearchSerializer(HaystackSerializer):
    class Meta:
        index_classes = [DishScheduleIndex]
        fields = ["id", "dish", "chef", "name", "cuisine", "description", "repeat_daily", "date", "text", 'thumbnail',
                  'ingredients']
