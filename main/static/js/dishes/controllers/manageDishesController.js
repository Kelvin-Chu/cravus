(function () {
    'use strict';

    angular.module('cravus.dishes').controller('manageDishesController', manageDishesController);
    manageDishesController.$inject = ['$rootScope', '$location', '$routeParams', 'authFactory', 'dishesFactory'];
    function manageDishesController($rootScope, $location, $routeParams, authFactory, dishesFactory) {
        var vm = this;
        vm.loading = false;
        vm.dishes = null;
        vm.newdish = {};
        vm.cuisines = ['American', 'Cajun', 'Chinese', 'Greek', 'Indian', 'Italian', 'Japanese', 'Korean',
            'Mediterranean', 'Mexican', 'Thai', 'Vietnamese', 'Other'];
        vm.add = add;

        activate();
        function activate() {
            var username = $routeParams.username.substr(1);
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
            if ($rootScope.authenticatedAccount) {
                if ($rootScope.authenticatedAccount.username !== username) {
                    toast('error', '#globalToast', 'You are not authorized to view this page.', 'none');
                    $location.url('/dishes');
                }
            }

            dishesFactory.get(username).then(dishesSuccessFn, dishesErrorFn);

            function dishesSuccessFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.dishes = data.data;
                } else {
                    vm.dishes = {};
                }
            }

            function dishesErrorFn(data, status, headers, config) {

            }
        }

        function add() {
            dishesFactory.create(vm.newdish).then(createDishSuccessFn, createDishErrorFn);
            vm.loading = true;
        }

        function createDishSuccessFn(data, status, headers, config) {
            vm.loading = false;
            toast('success', '#toastBounds', 'Dish created.  May take up to 24hrs for approval.', 'none');
        }

        function createDishErrorFn(data, status, headers, config) {
            $rootScope.$broadcast('dish.created.error');
            vm.loading = false;
            toast('error', '#toastBounds', 'Failed! Try again later.', 'none');
        }
    }

})();