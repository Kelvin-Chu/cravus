(function () {
    'use strict';

    angular.module('cravus.dishes').directive('dish', dish);
    function dish() {
        return {
            restrict: 'E',
            scope: {
                dish: '='
            },
            templateUrl: '/static/partials/dishes/dish.html'
        };
    }

})();