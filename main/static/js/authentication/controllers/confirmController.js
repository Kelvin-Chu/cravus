(function () {
    'use strict';

    angular.module('cravus.authentication').controller('confirmController', confirmController);
    confirmController.$inject = ['$rootScope', '$scope', '$routeParams', '$location', 'authFactory', 'ytplayerFactory'];
    function confirmController($rootScope, $scope, $routeParams, $location, authFactory, ytplayerFactory) {
        var vm = this;
        vm.scope = $scope;
        vm.errors = {};
        vm.formErrors = {};
        vm.setPassword = setPassword;

        activate();
        function activate() {
            $rootScope.title = "Set Password";
            vm.uid = $routeParams.uid;
            vm.token = $routeParams.token;
            if (!authFactory.isAuthenticated()) {
                ytplayerFactory.play();
            }
        }

        function setPassword() {
            authFactory.setPassword(vm).then(setPasswordSuccessFn, setPasswordErrorFn);
        }

        function setPasswordSuccessFn(data, status, headers, config) {
            $location.url('/login');
            toast('success', '#globalToast', "Password reset successful, please log in with your new password.", 'none');
            clearErrors(vm);
        }

        function setPasswordErrorFn(data, status, headers, config) {
            $location.url('/reset');
            toast('error', '#globalToast', 'Invalid uid or token, please try again.', 'none');
        }
    }

})();