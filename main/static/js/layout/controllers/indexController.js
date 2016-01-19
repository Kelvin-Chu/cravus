(function () {
    'use strict';

    angular.module('cravus.layout').controller('indexController', indexController);
    indexController.$inject = [
        '$rootScope',
        '$scope',
        'authFactory',
        'dishesFactory',
        'snackbarFactory',
        'ytplayerFactory'
    ];
    function indexController($rootScope, $scope, authFactory, dishesFactory, snackbarFactory, ytplayerFactory) {
        $rootScope.bgimg = 'static/img/bg2.jpg';
        $rootScope.hideHeader = false;
        ytplayerFactory.play();
        var vm = this;
        vm.isAuthenticated = authFactory.isAuthenticated();

        activate();
        function activate() {

        }
    }
})();