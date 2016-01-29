(function () {
    'use strict';

    angular.module('cravus.layout').controller('navbarController', navbarController);
    navbarController.$inject = ['authFactory'];
    function navbarController(authFactory) {
        var vm = this;
        vm.isOpen = false;
        vm.isCollapsed = true;
        vm.logout = logout;
        function logout() {
            authFactory.logout();
        }

        activate();
        function activate() {
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
        }
    }

})();