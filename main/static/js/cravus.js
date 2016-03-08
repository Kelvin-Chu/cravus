(function (window) {
    'use strict';

    angular.module('cravus', [
        'ngRoute',
        'ngAnimate',
        'infinite-scroll',
        'ngMaterial',
        'ngMessages',
        'ngFileUpload',
        'angularUtils.directives.dirDisqus',
        'ui.bootstrap',
        'akoenig.deckgrid',
        'ui.mask',
        'cravus.authentication',
        'cravus.cart',
        'cravus.layout',
        'cravus.profiles',
        'cravus.dishes'
    ]);
    angular.module('cravus').run(run);
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);
    run.$inject = ['$rootScope', '$route', '$http', '$mdDialog', 'cartFactory', 'authFactory'];
    function run($rootScope, $route, $http, $mdDialog, cartFactory, authFactory) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            $rootScope.route = $route;
            $mdDialog.cancel();
        });
        $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loading = true;
        });
        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.loading = false;
        });
        authFactory.isAuthenticated();
        authFactory.getAuthenticatedAccount();
        authFactory.refresh();
        cartFactory.init();
        cartFactory.setShipping(2.99);
        cartFactory.setTaxRate(8.25);
    }

    function classReg(className) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

    function toggleClass(elem, c) {
        var fn = hasClass(elem, c) ? removeClass : addClass;
        fn(elem, c);
    }

    //http://tympanus.net/codrops/2013/06/18/caption-hover-effects/
    if (Modernizr.touch) {
        var hasClass, addClass, removeClass;
        if ('classList' in document.documentElement) {
            hasClass = function (elem, c) {
                return elem.classList.contains(c);
            };
            addClass = function (elem, c) {
                elem.classList.add(c);
            };
            removeClass = function (elem, c) {
                elem.classList.remove(c);
            };
        }
        else {
            hasClass = function (elem, c) {
                return classReg(c).test(elem.className);
            };
            addClass = function (elem, c) {
                if (!hasClass(elem, c)) {
                    elem.className = elem.className + ' ' + c;
                }
            };
            removeClass = function (elem, c) {
                elem.className = elem.className.replace(classReg(c), ' ');
            };
        }
        var classie = {
            hasClass: hasClass,
            addClass: addClass,
            removeClass: removeClass,
            toggleClass: toggleClass,
            has: hasClass,
            add: addClass,
            remove: removeClass,
            toggle: toggleClass
        };
        if (typeof define === 'function' && define.amd) {
            define(classie);
        } else {
            window.classie = classie;
        }
    }

})(window);

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
        'timeOut': 3000,
        "preventDuplicates": true
    };
    if (style) {
        toastr.options['positionClass'] = style;
    } else {
        toastr.options['positionClass'] = 'toast-black';
    }
    toastr[level](message);
}