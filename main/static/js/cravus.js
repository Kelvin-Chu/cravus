(function () {
    'use strict';

    angular.module('cravus', [
        'ngRoute',
        'ngAnimate',
        'ngMaterial',
        'ngMessages',
        'ngFileUpload',
        'ui.bootstrap',
        'akoenig.deckgrid',
        'ui.mask',
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
    vm.showHints = false;
    var errorMessages = data.data;
    for (var name in errorMessages) {
        vm.errors[name] = true;
        vm.formErrors[name] = errorMessages[name][0];
    }
}

function clearErrors(vm) {
    vm.showHints = true;
    for (var name in vm.formErrors) {
        vm.errors[name] = false;
    }
    vm.formErrors = {};
}

function toast(level, target, message, style) {
    toastr.remove();
    toastr.options = {
        'target': $(target),
        'closeButton': true,
        'timeOut': 5000,
        "preventDuplicates": true
    };
    if (style) {
        toastr.options['positionClass'] = style;
    } else {
        toastr.options['positionClass'] = 'toast-black';
    }
    toastr[level](message);
}