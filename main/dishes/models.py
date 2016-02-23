import uuid
import os
from django.utils.datetime_safe import datetime
from django.db import models
from imagekit.models import ProcessedImageField
from pilkit.processors import Transpose
from authentication.models import Account, CUISINE_CHOICES


def generate_dishes_filename(self, filename):
    extension = os.path.splitext(filename)[1]
    path = os.path.join('dishes/' + datetime.now().strftime("%Y/%m/%d") + '/' + self.chef.username, '%s%s')
    return path % (uuid.uuid4(), extension)


class Dish(models.Model):
    chef = models.ForeignKey(Account)
    name = models.CharField(max_length=50, blank=True)
    cuisine = models.CharField(max_length=50, choices=CUISINE_CHOICES, default='')
    description = models.TextField(max_length=500, blank=True)
    image = ProcessedImageField(upload_to=generate_dishes_filename, processors=[Transpose(Transpose.AUTO)],
                                format='JPEG', options={'quality': 85}, blank=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
