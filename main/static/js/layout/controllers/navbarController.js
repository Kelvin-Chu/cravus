(function () {
    'use strict';

    angular.module('cravus.layout').controller('navbarController', navbarController);
    navbarController.$inject = ['$route', 'authFactory'];
    function navbarController($route, authFactory) {
        var vm = this;
        vm.isOpen = false;
        vm.isCollapsed = true;
        vm.route = $route;
        vm.isAuthenticated = authFactory.isAuthenticated();
        vm.isChef = authFactory.isChef();
        vm.user = authFactory.getAuthenticatedAccount();
        vm.logout = logout;
        function logout() {
            authFactory.logout();
        }
    }

})();