from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAuthenticated
from rest_framework.response import Response
from dishes.models import Dish
from dishes.permissions import IsChefOfDish
from dishes.serializers import DishSerializer


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.order_by('-created_at')
    serializer_class = DishSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, IsChefOfDish, ]
        return super(DishViewSet, self).get_permissions()

    def perform_create(self, serializer):
        instance = serializer.save(chef=self.request.user)
        return super(DishViewSet, self).perform_create(serializer)


class AccountDishesViewSet(viewsets.ViewSet):
    queryset = Dish.objects.select_related('chef').all()
    serializer_class = DishSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(chef__username=account_username)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
