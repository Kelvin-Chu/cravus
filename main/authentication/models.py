import uuid
import os
from django.utils.datetime_safe import datetime
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from imagekit.models import ProcessedImageField
from pilkit.processors import Transpose

STATE_CHOICES = (
    ('AL', 'AL'), ('AK', 'AK'), ('AZ', 'AZ'), ('AR', 'AR'), ('CA', 'CA'), ('CO', 'CO'), ('CT', 'CT'), ('DE', 'DE'),
    ('DC', 'DC'), ('FL', 'FL'), ('GA', 'GA'), ('HI', 'HI'), ('ID', 'ID'), ('IL', 'IL'), ('IN', 'IN'), ('IA', 'IA'),
    ('KS', 'KS'), ('KY', 'KY'), ('LA', 'LA'), ('ME', 'ME'), ('MD', 'MD'), ('MA', 'MA'), ('MI', 'MI'), ('MN', 'MN'),
    ('MS', 'MS'), ('MO', 'MO'), ('MT', 'MT'), ('NE', 'NE'), ('NV', 'NV'), ('NH', 'NH'), ('NJ', 'NJ'), ('NM', 'NM'),
    ('NY', 'NY'), ('NC', 'NC'), ('ND', 'ND'), ('OH', 'OH'), ('OK', 'OK'), ('OR', 'OR'), ('PA', 'PA'), ('RI', 'RI'),
    ('SC', 'SC'), ('SD', 'SD'), ('TN', 'TN'), ('TX', 'TX'), ('UT', 'UT'), ('VT', 'VT'), ('VA', 'VA'), ('WA', 'WA'),
    ('WV', 'WV'), ('WI', 'WI'), ('WY', 'WY'))


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

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_admin = True
        account.save()
        return account

    def create_chef(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_chef = True
        account.save()
        return account


class Account(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=40, unique=True)
    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    avatar = ProcessedImageField(upload_to=generate_avatar_filename, processors=[Transpose(Transpose.AUTO)],
                                 format='JPEG', options={'quality': 85}, blank=True)
    is_admin = models.BooleanField(default=False)
    is_chef = models.BooleanField(default=False)
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


class Address(models.Model):
    account = models.ForeignKey(Account)
    address1 = models.CharField(max_length=50, blank=True)
    address2 = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=2, choices=STATE_CHOICES, default='TX')
    zip = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return "%s at %s" % (self.account, self.address1)
