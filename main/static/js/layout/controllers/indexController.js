(function () {
    'use strict';

    angular.module('cravus.layout').controller('indexController', indexController);
    indexController.$inject = [
        '$rootScope',
        '$location',
        'authFactory',
        'ytplayerFactory'
    ];
    function indexController($rootScope, $location, authFactory, ytplayerFactory) {
        $rootScope.bgimg = 'static/img/bg2.jpg';
        $rootScope.hideHeader = false;
        ytplayerFactory.play();

        activate();
        function activate() {
            if (authFactory.isAuthenticated()) {
                $location.url('/dishes');
            }
        }
    }

})();