(function () {
    'use strict';

    angular.module('cravus.layout').controller('listDishesController', listDishesController);
    listDishesController.$inject = ['$rootScope', '$scope', 'authFactory', 'dishesFactory', 'snackbarFactory'];
    function listDishesController($rootScope, $scope, authFactory, dishesFactory, snackbarFactory) {
        $rootScope.bgimg = 'none';
        $rootScope.hideHeader = true;
        var vm = this;
        vm.isAuthenticated = authFactory.isAuthenticated();
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
                snackbarFactory.error(data.error);
            }
        }
    }
})();