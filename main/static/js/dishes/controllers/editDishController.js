(function () {
    'use strict';

    angular.module('cravus.dishes').controller('editDishController', editDishController);
    editDishController.$inject = ['$rootScope', '$mdDialog', 'authFactory', 'dishesFactory'];
    function editDishController($rootScope, $mdDialog, authFactory, dishesFactory) {
        var vm = this;
        vm.dish = {};
        vm.cuisines = dishesFactory.cuisines;
        vm.cancel = cancel;
        vm.del = del;
        vm.save = save;

        activate();
        function activate() {
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
            if (!$rootScope.authenticatedAccount) {
                toast('error', '#globalToast', 'You are not authorized to view this page.', 'none');
                $location.url('/dishes');
            }
            getDish();
        }

        function getDish() {
            dishesFactory.getDish(vm.id).then(getDishSuccessFn, getDishErrorFn);

            function getDishSuccessFn(data, status, headers, config) {
                vm.dish = data.data;
            }

            function getDishErrorFn(data, status, headers, config) {
                toast('error', '#globalToast', 'Problem connecting to server, refresh the page or try again later', 'none');
            }
        }

        function del() {
            $mdDialog.hide({action: "delete", id: vm.id});
        }

        function save() {
            dishesFactory.updateDish(vm.dish).then(updateDishSuccessFn, updateDishErrorFn);

            function updateDishSuccessFn(data, status, headers, config) {
                toast('success', '#globalToast', "Dish updated.", 'none');
                $mdDialog.hide({action: "update", data: data.data});
            }

            function updateDishErrorFn(data, status, headers, config) {
                toast('error', '#globalToast', 'Problem connecting to server, refresh the page or try again later', 'none');
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }

})();