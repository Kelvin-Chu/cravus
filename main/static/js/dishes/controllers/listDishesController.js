(function () {
    'use strict';

    angular.module('cravus.layout').controller('listDishesController', listDishesController);
    listDishesController.$inject = ['$scope', 'dishesFactory', 'ytplayerFactory'];
    function listDishesController($scope, dishesFactory, ytplayerFactory) {
        ytplayerFactory.stop();
        var vm = this;
        vm.dishes = [];

        activate();
        function activate() {
            dishesFactory.all().then(dishesSuccessFn, dishesErrorFn);

            $scope.$on('dish.created', function (event, dish) {
                vm.dishes.unshift(dish);
            });

            $scope.$on('dish.created.error', function () {
                vm.dishes.shift();
            });

            function dishesSuccessFn(data, status, headers, config) {
                vm.dishes = data.data;
            }

            function dishesErrorFn(data, status, headers, config) {
                toast('error', '#globalToast', 'Site in maintenance, try again later!', 'none');
            }
        }
    }
})();