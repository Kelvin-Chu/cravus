(function () {
    'use strict';

    angular.module('cravus.authentication').controller('loginController', loginController);
    loginController.$inject = ['$rootScope', '$scope', 'authFactory', 'ytplayerFactory'];
    function loginController($rootScope, $scope, authFactory, ytplayerFactory) {
        var vm = this;
        vm.scope = $scope;
        vm.errors = {};
        vm.formErrors = {};
        vm.login = login;
        function login() {
            authFactory.login(vm);
        }

        activate();
        function activate() {
            $rootScope.title = "Login";
            if (!authFactory.isAuthenticated()) {
                ytplayerFactory.play();
            }
        }
    }

})();