(function () {
    'use strict';

    angular.module('cravus.authentication').controller('loginController', loginController);
    loginController.$inject = ['$scope', 'authFactory', 'ytplayerFactory'];
    function loginController($scope, authFactory, ytplayerFactory) {
        ytplayerFactory.play();
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
            if (!authFactory.isAuthenticated()) {
                ytplayerFactory.play();
            }
        }
    }

})();