(function () {
    'use strict';

    angular.module('cravus.dishes').controller('newDishController', newDishController);
    newDishController.$inject = ['$rootScope', '$scope', 'authFactory', '$mdToast', 'dishesFactory'];
    function newDishController($rootScope, $scope, authFactory, $mdToast, dishesFactory) {
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
                $mdToast.show($mdToast.simple().textContent('Success! Dish created.').hideDelay(3000));
            }

            function createDishErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('dish.created.error');
                $mdToast.show($mdToast.simple().textContent('Failed! Try again later.').hideDelay(3000));
            }
        }
    }

})();