(function () {
    'use strict';

    angular.module('cravus.layout').controller('navbarController', navbarController);
    navbarController.$inject = ['$route', 'authFactory'];
    function navbarController($route, authFactory) {
        var vm = this;
        vm.isCollapsed = true;
        vm.route = $route;
        vm.isAuthenticated = authFactory.isAuthenticated();
        vm.user = authFactory.getAuthenticatedAccount();
        vm.logout = logout;
        function logout() {
            authFactory.logout();
        }
    }

})();