from django.conf.urls import url, include
from django.contrib import admin
from rest_framework_nested import routers
from authentication.views import AccountViewSet
from cravus.views import IndexView
from rest_framework_jwt import views
from dishes.views import AccountDishesViewSet, DishViewSet

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'dishes', DishViewSet)
accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
accounts_router.register(r'dishes', AccountDishesViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/auth/login/$', views.obtain_jwt_token, name='login'),
    url(r'^api/v1/auth/refresh/$', views.refresh_jwt_token, name='refresh'),
    url(r'^api/v1/auth/verify/$', views.verify_jwt_token, name='verify'),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^.*$', IndexView.as_view(), name='index'),
]
