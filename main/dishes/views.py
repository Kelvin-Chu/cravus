import datetime
from django.db.models import Q
from rest_framework import viewsets, mixins, status
from rest_framework.permissions import SAFE_METHODS, AllowAny
from rest_framework.response import Response
from .utils import DishThrottle
from .models import Dish, DishSchedule
from .permissions import IsChefOfDish, IsChef
from .serializers import DishSerializer, DishScheduleSerializer


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


class DishScheduleViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.DestroyModelMixin,
                          viewsets.GenericViewSet):
    queryset = DishSchedule.objects.all()
    serializer_class = DishScheduleSerializer
    throttle_classes = [DishThrottle]

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [AllowAny, ]
        elif self.request.method == 'POST':
            self.permission_classes = [IsChef, ]
        else:
            self.permission_classes = [IsChefOfDish, ]
        return super(DishScheduleViewSet, self).get_permissions()

    def perform_create(self, serializer):
        serializer.save(chef=self.request.user)

    def filter_queryset(self, queryset):
        date_str = self.request.query_params.get('date', None)
        if date_str:
            try:
                date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
                queryset = queryset.filter(Q(date=date) | Q(repeat_daily=True)).order_by('-created_at')
            except Exception:
                pass
        return queryset


class AccountDishScheduleViewSet(viewsets.ViewSet):
    queryset = DishSchedule.objects.select_related('chef').all()
    serializer_class = DishScheduleSerializer

    def list(self, request, account_username=None):
        date_str = self.request.query_params.get('date', None)
        if not date_str:
            return Response("Date is required.", status=status.HTTP_400_BAD_REQUEST)
        try:
            date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        except Exception:
            return Response("Date has wrong format. Use one of these formats instead: YYYY-MM-DD.",
                            status=status.HTTP_400_BAD_REQUEST)
        queryset = self.queryset.filter(Q(chef__username=account_username),
                                        Q(date=date) | Q(repeat_daily=True)).order_by('-created_at')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
