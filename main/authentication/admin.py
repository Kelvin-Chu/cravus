from django.contrib import admin
from .models import Account, Address, Chef


class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'is_active', 'is_chef', 'is_admin')


class AddressAdmin(admin.ModelAdmin):
    list_display = ('account', 'address1', 'city', 'state', 'zip', 'latitude', 'longitude')


class ChefAdmin(admin.ModelAdmin):
    list_display = ('account', 'delivery', 'pickup', 'credit', 'background', 'featured')


admin.site.register(Account, AccountAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(Chef, ChefAdmin)
