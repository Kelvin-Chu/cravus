(function () {
    'use strict';

    angular.module('cravus.layout').controller('indexController', indexController);
    indexController.$inject = ['ytplayerFactory', 'authFactory'];
    function indexController(ytplayerFactory, authFactory) {
        activate();
        function activate() {
            if (!authFactory.isAuthenticated()) {
                ytplayerFactory.play();
            }
        }
    }

})();