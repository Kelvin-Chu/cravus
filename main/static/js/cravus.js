(function () {
    'use strict';

    angular.module('cravus', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMessages',
        'ngImgCrop',
        'ngFileUpload',
        'ui.bootstrap',
        'akoenig.deckgrid',
        'cravus.authentication',
        'cravus.layout',
        'cravus.profiles',
        'cravus.dishes'
    ]);
    angular.module('cravus').run(run);
    run.$inject = ['$rootScope', '$route', '$http'];
    function run($rootScope, $route, $http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            $rootScope.route = $route;
        });
    }

})();

function setErrors(vm, data) {
    var errorMessages = data.data;
    for (var name in errorMessages) {
        vm.errors[name] = true;
        vm.formErrors[name] = errorMessages[name][0];
    }
}

function clearErrors(vm) {
    for (var name in vm.formErrors) {
        vm.errors[name] = false;
    }
    vm.formErrors = {};
}