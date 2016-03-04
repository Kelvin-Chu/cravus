(function () {
    'use strict';

    angular.module('cravus.layout').controller('navbarController', navbarController);
    navbarController.$inject = ['$rootScope', 'authFactory', '$location'];
    function navbarController($rootScope, authFactory, $location) {
        var vm = this;
        vm.isOpen = false;
        vm.isCollapsed = true;
        vm.query = null;
        vm.logout = logout;
        vm.search = search;

        activate();
        function activate() {
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
        }

        function logout() {
            authFactory.logout();
        }

        function search() {
            if ($location.path() != '/dishes') {
                $location.url('/dishes/?query=' + vm.query);
            } else {
                $rootScope.$broadcast('dish.search', vm.query);
            }
        }
    }

})();