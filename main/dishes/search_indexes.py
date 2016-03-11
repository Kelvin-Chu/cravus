from datetime import timedelta

from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from haystack import indexes
from .models import DishSchedule


class DishScheduleIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    id = indexes.IntegerField(model_attr='id')
    chef = indexes.NgramField(model_attr='chef__username')
    dish = indexes.IntegerField(model_attr='dish__id')
    name = indexes.NgramField(model_attr='dish__name')
    cuisine = indexes.CharField(model_attr='dish__cuisine')
    repeat_daily = indexes.BooleanField(model_attr='repeat_daily')
    description = indexes.NgramField(model_attr='dish__description')
    ingredients = indexes.NgramField()
    coordinate = indexes.LocationField(model_attr="chef__address__coordinates")
    date = indexes.DateField(model_attr='date')
    thumbnail = indexes.CharField()

    def get_model(self):
        return DishSchedule

    def index_queryset(self, using=None):
        queryset = self.get_model().objects.filter(
            (Q(date__lte=timezone.now() + timedelta(days=7)) & Q(date__gt=timezone.now() - timedelta(days=2))) | Q(
                repeat_daily=True))
        return queryset

    @staticmethod
    def prepare_thumbnail(obj):
        if obj.dish.image:
            return obj.dish.thumbnail.url
        return getattr(settings, 'DEFAULT_DISH_IMAGE', None)

    @staticmethod
    def prepare_ingredients(obj):
        return [ingredient.name for ingredient in obj.dish.ingredients.all()]
