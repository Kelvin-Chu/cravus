(function () {
    'use strict';

    angular.module('cravus.authentication').controller('registerController', registerController);
    registerController.$inject = ['$scope', '$route', 'authFactory', 'ytplayerFactory'];
    function registerController($scope, $route, authFactory, ytplayerFactory) {
        ytplayerFactory.play();
        var vm = this;
        vm.scope = $scope;
        vm.errors = {};
        vm.formErrors = {};
        vm.route = $route;
        activate();
        function activate() {
            if (!authFactory.isAuthenticated()) {
                ytplayerFactory.play();
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