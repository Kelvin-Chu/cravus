(function () {
    'use strict';

    angular.module('cravus.dishes').controller('editDishController', editDishController);
    editDishController.$inject = ['$rootScope', '$mdDialog', 'authFactory', 'dishesFactory', '$mdConstant'];
    function editDishController($rootScope, $mdDialog, authFactory, dishesFactory, $mdConstant) {
        var vm = this;
        vm.errors = {};
        vm.formErrors = {};
        vm.cuisines = dishesFactory.cuisines;
        vm.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
        vm.cancel = cancel;
        vm.del = del;
        vm.save = save;

        activate();
        function activate() {
            $rootScope.loading = false;
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
            if (!$rootScope.authenticatedAccount) {
                toast('error', '#globalToast', 'You are not authorized to view this page.', 'none');
                $location.url('/dishes');
            }
        }

        function del() {
            $mdDialog.hide({action: "delete", id: vm.dish.id});
        }

        function save() {
            clearErrors(vm);
            var input = document.querySelector(".md-chip-input-container > input");
            var last = input.value;
            if (/\S/.test(last)) {
                last = last.split(',');
                for (var i = 0; i < last.length; i++) {
                    last[i] = last[i].trim();
                }
                vm.dish.ingredients = _.union(vm.dish.ingredients, last);
            }
            dishesFactory.updateDish(vm.dish).then(updateDishSuccessFn, updateDishErrorFn);

            function updateDishSuccessFn(data, status, headers, config) {
                toast('success', '#globalToast', "Dish updated.", 'none');
                $mdDialog.hide({action: "update", data: data.data});
            }

            function updateDishErrorFn(data, status, headers, config) {
                setErrors(vm, data);
                toast('error', '#globalToast', 'Could not edit dish, please check your input.', 'none');
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }

})();