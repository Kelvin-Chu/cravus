(function () {
    'use strict';

    angular.module('cravus.cart').controller('cartController', cartController);
    cartController.$inject = ['$rootScope', 'cartFactory', 'ytplayerFactory'];
    function cartController($rootScope, cartFactory, ytplayerFactory) {
        var vm = this;
        vm.cartFactory = cartFactory;
        vm.cartEmpty = cartFactory.getTotalItems() === 0;
        activate();

        function activate() {
            $rootScope.title = "Shopping Cart";
            ytplayerFactory.stop();
        }
    }

})();