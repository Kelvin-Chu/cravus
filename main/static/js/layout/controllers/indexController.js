(function () {
    'use strict';

    angular.module('cravus.layout').controller('indexController', indexController);
    indexController.$inject = [
        '$location',
        'authFactory',
        'ytplayerFactory'
    ];
    function indexController($location, authFactory, ytplayerFactory) {
        ytplayerFactory.play();

        activate();
        function activate() {
            if (authFactory.isAuthenticated()) {
                $location.url('/dishes');
            }
        }
    }

})();