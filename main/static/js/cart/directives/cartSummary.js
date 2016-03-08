(function () {
    'use strict';

    angular.module('cravus.cart').directive('cartSummary', cartSummary);
    function cartSummary() {
        var controller = ['$scope', 'cartFactory', function ($scope, cartFactory) {
            var vm = this;
            vm.cartFactory = cartFactory;
        }];

        return {
            restrict: 'E',
            scope: {extra: "@"},
            template: '<a href="/cart"><span>{{ vm.cartFactory.getTotalItems() }}</span> <i class="fa fa-shopping-cart {{ ::vm.extra }}"></i></a>',
            controller: controller,
            controllerAs: 'vm',
            bindToController: true
        };
    }

})();