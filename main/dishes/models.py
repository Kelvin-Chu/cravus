import uuid
import os
from django.utils.datetime_safe import datetime
from django.db import models
from imagekit.models import ProcessedImageField, ImageSpecField
from pilkit.processors import Transpose, ResizeToFit
from authentication.models import Account, CUISINE_CHOICES


def generate_dishes_filename(self, filename):
    extension = os.path.splitext(filename)[1]
    path = os.path.join('dishes/' + datetime.now().strftime("%Y/%m/%d") + '/' + self.chef.username, '%s%s')
    return path % (uuid.uuid4(), extension)


class Dish(models.Model):
    chef = models.ForeignKey(Account)
    name = models.CharField(max_length=50, blank=False, null=False)
    cuisine = models.CharField(max_length=50, choices=CUISINE_CHOICES, default='')
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    description = models.TextField(max_length=500, blank=True)
    image = ProcessedImageField(upload_to=generate_dishes_filename,
                                processors=[Transpose(Transpose.AUTO), ResizeToFit(1024, 1024, False)],
                                format='JPEG', options={'quality': 90}, blank=True)
    thumbnail = ImageSpecField(source='image', processors=[ResizeToFit(500, 500, False)],
                                    format='JPEG', options={'quality': 75})
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class DishSchedule(models.Model):
    chef = models.ForeignKey(Account)
    date = models.DateField(db_index=True, null=False)
    dish = models.ForeignKey(Dish)
    repeat_daily = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('chef', 'date', 'dish')

    def __str__(self):
        return self.dish.name
