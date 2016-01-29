(function () {
    'use strict';

    angular.module('cravus', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMessages',
        'ui.bootstrap',
        'akoenig.deckgrid',
        'cravus.authentication',
        'cravus.layout',
        'cravus.profiles',
        'cravus.dishes'
    ]);
    angular.module('cravus').run(run);
    run.$inject = ['$http'];
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();