import uuid
import os
from django.conf import settings
from django.utils.datetime_safe import datetime
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from imagekit.models import ProcessedImageField
from pilkit.processors import Transpose, ResizeToFit
from haystack.utils.geo import Point

STATE_CHOICES = (
    ('AL', 'AL'), ('AK', 'AK'), ('AZ', 'AZ'), ('AR', 'AR'), ('CA', 'CA'), ('CO', 'CO'), ('CT', 'CT'), ('DE', 'DE'),
    ('DC', 'DC'), ('FL', 'FL'), ('GA', 'GA'), ('HI', 'HI'), ('ID', 'ID'), ('IL', 'IL'), ('IN', 'IN'), ('IA', 'IA'),
    ('KS', 'KS'), ('KY', 'KY'), ('LA', 'LA'), ('ME', 'ME'), ('MD', 'MD'), ('MA', 'MA'), ('MI', 'MI'), ('MN', 'MN'),
    ('MS', 'MS'), ('MO', 'MO'), ('MT', 'MT'), ('NE', 'NE'), ('NV', 'NV'), ('NH', 'NH'), ('NJ', 'NJ'), ('NM', 'NM'),
    ('NY', 'NY'), ('NC', 'NC'), ('ND', 'ND'), ('OH', 'OH'), ('OK', 'OK'), ('OR', 'OR'), ('PA', 'PA'), ('RI', 'RI'),
    ('SC', 'SC'), ('SD', 'SD'), ('TN', 'TN'), ('TX', 'TX'), ('UT', 'UT'), ('VT', 'VT'), ('VA', 'VA'), ('WA', 'WA'),
    ('WV', 'WV'), ('WI', 'WI'), ('WY', 'WY'))

KITCHEN_TYPE_CHOICES = (
    ('Homemade', 'homemade'), ('Restaurant', 'restaurant'), ('Food Truck', 'foodtruck'), ('Fast Food', 'fastfood'),
    ('Other', 'other'), ('', ''))

CUISINE_CHOICES = (
    ('American', 'american'), ('Cajun', 'cajun'), ('Chinese', 'chinese'), ('French', 'french'), ('Greek', 'greek'),
    ('Indian', 'indian'), ('Italian', 'italian'), ('Japanese', 'japanese'), ('Korean', 'korean'),
    ('Mediterranean', 'mediterranean'), ('Mexican', 'mexican'), ('Thai', 'thai'), ('Vietnamese', 'vietnamese'),
    ('Other', 'other'), ('', ''))


def generate_avatar_filename(self, filename):
    extension = os.path.splitext(filename)[1]
    path = os.path.join('avatars/' + datetime.now().strftime("%Y/%m/%d") + '/' + self.username, '%s%s')
    return path % (uuid.uuid4(), extension)


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')
        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')
        account = self.model(email=self.normalize_email(email), username=kwargs.get('username'))
        account.set_password(password)
        account.save()
        address = Address(account=account)
        address.save()
        return account

    def create_superuser(self, email, password=None, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_admin = True
        account.save()
        return account

    def create_chef(self, email, password=None, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_chef = True
        account.save()
        chef = Chef(account=account)
        chef.save()
        return account


class Account(AbstractBaseUser):
    email = models.EmailField(max_length=254, unique=True)
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    mobile = models.CharField(max_length=16, unique=True, blank=True, null=True)
    avatar = ProcessedImageField(upload_to=generate_avatar_filename,
                                 processors=[Transpose(Transpose.AUTO), ResizeToFit(600, 600, False)],
                                 format='JPEG', options={'quality': 85}, blank=True)
    is_admin = models.BooleanField(default=False)
    is_chef = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = AccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    @property
    def is_superuser(self):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    def get_avatar(self):
        if self.avatar:
            return self.avatar.url
        elif self.is_chef:
            return getattr(settings, 'DEFAULT_CHEF_IMAGE', None)
        else:
            return getattr(settings, 'DEFAULT_PROFILE_IMAGE', None)


class Address(models.Model):
    account = models.OneToOneField(Account, related_name="address", on_delete=models.CASCADE, primary_key=True)
    address1 = models.CharField(max_length=150, blank=True)
    address2 = models.CharField(max_length=150, blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=2, choices=STATE_CHOICES, default=None, blank=True, null=True)
    zip = models.CharField(max_length=10, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s at %s" % (self.account.username, self.address1)

    @property
    def coordinates(self):
        return Point(self.longitude, self.latitude)


class Chef(models.Model):
    account = models.OneToOneField(Account, related_name="chef", on_delete=models.CASCADE, primary_key=True)
    tagline = models.TextField(max_length=150, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    cuisine = models.CharField(max_length=50, choices=CUISINE_CHOICES, default='')
    type = models.CharField(max_length=50, choices=KITCHEN_TYPE_CHOICES, default='')
    delivery = models.BooleanField(default=True)
    pickup = models.BooleanField(default=True)
    credit = models.BooleanField(default=True)
    background = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return "%s" % (self.account)
