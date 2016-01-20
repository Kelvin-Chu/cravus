(function () {
    'use strict';

    angular.module('cravus.layout').controller('indexController', indexController);
    indexController.$inject = [
        '$rootScope',
        'authFactory',
        'ytplayerFactory'
    ];
    function indexController($rootScope, authFactory, ytplayerFactory) {
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