(function () {
    'use strict';

    angular.module('cravus.layout').controller('indexController', indexController);
    indexController.$inject = ['$rootScope', 'ytplayerFactory', 'authFactory'];
    function indexController($rootScope, ytplayerFactory, authFactory) {
        activate();
        function activate() {
            $rootScope.title = "Home";
            if (!authFactory.isAuthenticated()) {
                ytplayerFactory.play();
            }
        }
    }

})();