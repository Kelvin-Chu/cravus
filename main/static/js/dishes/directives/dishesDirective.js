(function () {
    'use strict';

    angular.module('cravus.dishes').directive('dishes', dishes);
    function dishes() {
        return {
            controller: 'dishesController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                dishes: '='
            },
            templateUrl: '/static/partials/dishes/dishes.html'
        };
    }
})();