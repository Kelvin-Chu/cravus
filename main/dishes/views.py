from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS, AllowAny
from rest_framework.response import Response
from .utils import DishThrottle
from .models import Dish
from .permissions import IsChefOfDish, IsChef
from .serializers import DishSerializer


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.order_by('-created_at')
    serializer_class = DishSerializer
    throttle_classes = [DishThrottle, ]

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [AllowAny, ]
        elif self.request.method == 'POST':
            self.permission_classes = [IsChef, ]
        else:
            self.permission_classes = [IsChefOfDish, ]
        return super(DishViewSet, self).get_permissions()

    def perform_create(self, serializer):
        serializer.save(chef=self.request.user)


class AccountDishesViewSet(viewsets.ViewSet):
    queryset = Dish.objects.select_related('chef').all()
    serializer_class = DishSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(chef__username=account_username).order_by('-created_at')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
