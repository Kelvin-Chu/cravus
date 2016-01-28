import uuid
import os
from django.utils.datetime_safe import datetime
from django.db import models
from imagekit.models import ProcessedImageField
from pilkit.processors import Transpose
from authentication.models import Account


def generate_dishes_filename(self, filename):
    extension = os.path.splitext(filename)[1]
    path = os.path.join('dishes/' + datetime.now().strftime("%Y/%m/%d") + '/' + self.user.username, '%s%s')
    return path % (uuid.uuid4(), extension)


class Dish(models.Model):
    chef = models.ForeignKey(Account)
    name = models.TextField()
    description = models.TextField()
    image = ProcessedImageField(upload_to=generate_dishes_filename, processors=[Transpose(Transpose.AUTO)],
                                format='JPEG', options={'quality': 85}, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name
