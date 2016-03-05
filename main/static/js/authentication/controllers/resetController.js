(function () {
    'use strict';

    angular.module('cravus.authentication').controller('resetController', resetController);
    resetController.$inject = ['$rootScope', '$scope', 'authFactory', 'ytplayerFactory'];
    function resetController($rootScope, $scope, authFactory, ytplayerFactory) {
        var vm = this;
        vm.scope = $scope;
        vm.errors = {};
        vm.formErrors = {};
        vm.sent = false;
        vm.reset = reset;
        function reset() {
            authFactory.reset(vm.email).then(resetSuccessFn, resetErrorFn);
        }

        function resetSuccessFn(data, status, headers, config) {
            angular.element( '#submit').text("Sent");
            vm.sent = true;
            toast('success', '#globalToast', "Email Sent.", 'none');
            clearErrors(vm);
        }

        function resetErrorFn(data, status, headers, config) {
            toast('error', '#globalToast', 'User not found.', 'none');
        }

        activate();
        function activate() {
            $rootScope.title = "Forgot my password";
            if (!authFactory.isAuthenticated()) {
                ytplayerFactory.play();
            }
        }
    }

})();