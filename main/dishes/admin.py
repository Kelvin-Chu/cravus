from django.contrib import admin
from .models import Dish, DishSchedule


class DishAdmin(admin.ModelAdmin):
    list_display = ('id', 'chef', 'name', 'price')


class DishScheduleAdmin(admin.ModelAdmin):
    list_display = ('id', 'dish', 'dish_chef', 'date', 'repeat_daily')

    @staticmethod
    def dish_chef(instance):
        return instance.dish.chef.username


admin.site.register(Dish, DishAdmin)
admin.site.register(DishSchedule, DishScheduleAdmin)
