(function () {
    'use strict';

    angular.module('cravus.authentication').controller('registerController', registerController);
    registerController.$inject = [
        '$location',
        '$rootScope',
        '$scope',
        'authFactory',
        'ytplayerFactory'
    ];
    function registerController($location, $rootScope, $scope, authFactory, ytplayerFactory) {
        $rootScope.bgimg = 'static/img/bg2.jpg';
        $rootScope.hideHeader = false;
        ytplayerFactory.play();
        var vm = this;
        activate();
        function activate() {
            if (authFactory.isAuthenticated()) {
                $location.url('/');
            }
        }

        vm.register = register;
        function register() {
            authFactory.register(vm.email, vm.password, vm.username);
        }
    }

})();