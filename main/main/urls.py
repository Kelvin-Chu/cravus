from django.conf.urls import url, include
from django.contrib import admin
from djoser.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_nested import routers
from authentication.views import AccountViewSet, AccountAddressViewSet, AddressViewSet, ChefAccountViewSet
from chefs.views import ChefViewSet
from cravus.views import IndexView
from rest_framework_jwt import views
from dishes.views import AccountDishesViewSet, DishViewSet, DishScheduleViewSet, AccountDishScheduleViewSet, \
    DishScheduleSearchView

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'chefs', ChefAccountViewSet)
router.register(r'chef', ChefViewSet)
router.register(r'dishes', DishViewSet)
router.register(r'schedule/search', DishScheduleSearchView, base_name='dish_schedule_search')
router.register(r'schedule', DishScheduleViewSet)
accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
accounts_router.register(r'addresses', AccountAddressViewSet)
accounts_router.register(r'dishes', AccountDishesViewSet)
accounts_router.register(r'schedule', AccountDishScheduleViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/auth/login/$', views.obtain_jwt_token, name='login'),
    url(r'^api/v1/auth/refresh/$', views.refresh_jwt_token, name='refresh'),
    url(r'^api/v1/auth/verify/$', views.verify_jwt_token, name='verify'),
    url(r'^api/v1/auth/reset/$', PasswordResetView.as_view(), name='reset'),
    url(r'^api/v1/auth/confirm/$', PasswordResetConfirmView.as_view(), name='confirm'),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^.*$', IndexView.as_view(), name='index'),
]
