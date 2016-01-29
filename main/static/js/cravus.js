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
    for (var name in data.data) {
        if (vm.scope.userForm[name]) {
            vm.formErrors[name] = data.data[name][0];
            vm.scope.userForm[name].$setValidity('server', false);
        }
        else if (name == 'non_field_errors') {
            vm.non_field_errors['server'] = true;
            vm.formErrors[name] = data.data[name][0];
        }
    }
}

function clearErrors(vm) {
    console.log(vm.scope.userForm);
    for (var name in vm.formErrors) {
        if (vm.scope.userForm[name]) {
            vm.scope.userForm[name].$setValidity('server', true);
        }
        else if (name == 'non_field_errors') {
            vm.non_field_errors['server'] = false;
        }
    }
}