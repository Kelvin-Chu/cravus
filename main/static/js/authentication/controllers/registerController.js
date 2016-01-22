(function () {
    'use strict';

    angular.module('cravus.authentication').controller('registerController', registerController);
    registerController.$inject = [
        '$location',
        '$route',
        'authFactory',
        'ytplayerFactory'
    ];
    function registerController($location, $route, authFactory, ytplayerFactory) {
        ytplayerFactory.play();
        var vm = this;
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
                authFactory.register(vm.email, vm.password, vm.username);
            } else {
                authFactory.chefRegister(vm.email, vm.password, vm.username);
            }
        }
    }

})();