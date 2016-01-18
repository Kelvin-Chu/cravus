(function () {
    'use strict';

    angular.module('cravus.authentication').controller('loginController', loginController);
    loginController.$inject = ['$location', '$rootScope', '$scope', 'authFactory'];
    function loginController($location, $rootScope, $scope, authFactory) {
        $rootScope.bgimg = 'static/img/bg2.jpg';
        $rootScope.hideHeader = false;
        var vm = this;
        vm.login = login;
        function login() {
            authFactory.login(vm.email, vm.password);
        }

        activate();
        function activate() {
            // If the user is authenticated, they should not be here.be here.
            if (authFactory.isAuthenticated()) {
                $location.url('/');
            }
        }
    }

})();