(function () {
    'use strict';

    angular.module('cravus.authentication').controller('simpleLoginController', simpleLoginController);
    simpleLoginController.$inject = ['$rootScope', '$scope', 'authFactory', 'ytplayerFactory'];
    function simpleLoginController($rootScope, $scope, authFactory, ytplayerFactory) {
        var vm = this;
        vm.scope = $scope;
        vm.errors = {};
        vm.formErrors = {};
        vm.login = login;
        function login() {
            authFactory.login(vm, '', true);
        }

        activate();
        function activate() {
            $rootScope.noheader = true;
            ytplayerFactory.stop();
            $rootScope.title = "Login";
        }
    }

})();