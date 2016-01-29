(function () {
    'use strict';

    angular.module('cravus.authentication').controller('registerController', registerController);
    registerController.$inject = [
        '$scope',
        '$location',
        '$route',
        'authFactory',
        'ytplayerFactory'
    ];
    function registerController($scope, $location, $route, authFactory, ytplayerFactory) {
        ytplayerFactory.play();
        var vm = this;
        vm.scope = $scope;
        vm.non_field_errors = {};
        vm.formErrors = {};
        vm.route = $route;
        activate();
        function activate() {
            if (authFactory.isAuthenticated()) {
                $location.url('/');
            }
        }

        vm.register = register;
        function register(chefregister) {
            if (!chefregister) {
                authFactory.register(vm);
            } else {
                authFactory.chefRegister(vm);
            }
        }
    }

})();