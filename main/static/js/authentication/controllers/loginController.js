(function () {
    'use strict';

    angular.module('cravus.authentication').controller('loginController', loginController);
    loginController.$inject = [
        '$scope',
        '$location',
        'authFactory',
        'ytplayerFactory'
    ];
    function loginController($scope, $location, authFactory, ytplayerFactory) {
        ytplayerFactory.play();
        var vm = this;
        vm.scope = $scope;
        vm.non_field_errors = {};
        vm.formErrors = {};
        vm.login = login;
        function login() {
            authFactory.login(vm);
        }

        activate();
        function activate() {
            if (authFactory.isAuthenticated()) {
                $location.url('/');
            }
        }
    }

})();