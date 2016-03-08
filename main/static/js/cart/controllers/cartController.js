(function () {
    'use strict';

    angular.module('cravus.cart').controller('cartController', cartController);
    cartController.$inject = ['$rootScope', 'cartFactory', 'ytplayerFactory'];
    function cartController($rootScope, cartFactory, ytplayerFactory) {
        var vm = this;
        vm.cartFactory = cartFactory;
        vm.cartEmpty = cartFactory.getTotalItems() === 0;
        vm.today = {};
        vm.today.empty = cartFactory.getItemsByDate('today').length === 0;
        vm.today.time = 24;
        vm.today.times = [{'value': 24, 'string': 'Within 1 hour'}, {'value': 11, 'string': '11:00am'},
            {'value': 12, 'string': '12:00pm'}, {'value': 13, 'string': '01:00pm'}, {'value': 14, 'string': '02:00pm'},
            {'value': 17, 'string': '05:00pm'}, {'value': 18, 'string': '06:00pm'}, {'value': 19, 'string': '07:00pm'},
            {'value': 20, 'string': '08:00pm'}, {'value': 21, 'string': '09:00pm'}];
        vm.tomorrow = {};
        vm.tomorrow.empty = cartFactory.getItemsByDate('tomorrow').length === 0;
        vm.tomorrow.time = 11;
        vm.tomorrow.times = [{'value': 11, 'string': '11:00am'},
            {'value': 12, 'string': '12:00pm'}, {'value': 13, 'string': '01:00pm'}, {'value': 14, 'string': '02:00pm'},
            {'value': 17, 'string': '05:00pm'}, {'value': 18, 'string': '06:00pm'}, {'value': 19, 'string': '07:00pm'},
            {'value': 20, 'string': '08:00pm'}, {'value': 21, 'string': '09:00pm'}];
        activate();

        function activate() {
            $rootScope.title = "Shopping Cart";
            ytplayerFactory.stop();
        }
    }

})();