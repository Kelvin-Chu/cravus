(function () {
    'use strict';

    angular.module('cravus.cart')
        .directive('addToCart', ['cartFactory', '$location', function (cartFactory, $location) {
            return {
                restrict: 'E',
                scope: {
                    id: '@',
                    name: '@',
                    quantity: '@',
                    quantityMax: '@',
                    price: '@',
                    date: '@',
                    time: '@',
                    data: '='
                },
                template: '<md-button class="md-raised md-primary" ng-click="::add()">Add to Cart</md-button>',
                link: function (scope, element, attrs) {
                    scope.add = function () {
                        cartFactory.addItem(scope.id, scope.name, scope.price, scope.quantity, scope.date, scope.time, scope.data);
                        toast('success', '#globalToast', 'Item added to shopping cart.', 'none');
                        $location.url('/cart');
                    };
                }
            }
        }]);

})();