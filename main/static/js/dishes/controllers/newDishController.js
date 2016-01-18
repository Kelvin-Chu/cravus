(function () {
    'use strict';

    angular.module('cravus.dishes').controller('newDishController', newDishController);
    newDishController.$inject = ['$rootScope', '$scope', 'authFactory', 'snackbarFactory', 'dishesFactory'];
    function newDishController($rootScope, $scope, authFactory, snackbarFactory, dishesFactory) {
        var vm = this;
        vm.submit = submit;

        function submit() {
            $rootScope.$broadcast('dish.created', {
                name: vm.name,
                description: vm.description,
                chef: {
                    username: authFactory.getAuthenticatedAccount().username
                }
            });
            $scope.closeThisDialog();
            dishesFactory.create(vm.name, vm.description).then(createDishSuccessFn, createDishErrorFn);

            function createDishSuccessFn(data, status, headers, config) {
                snackbarFactory.show('Success! Dish created.');
            }

            function createDishErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('dish.created.error');
                snackbarFactory.error(data.error);
            }
        }
    }

})();