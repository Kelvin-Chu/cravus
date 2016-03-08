(function () {
    'use strict';

    angular.module('cravus').config(config);
    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$mdThemingProvider'];
    function config($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider) {
        $routeProvider.when('/register', {
            controller: 'registerController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/register.html',
            login: false,
            index: true,
            resolve: {"check": loggedIn}
        }).when('/chef/register', {
            controller: 'registerController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/register.html',
            login: false,
            index: true,
            chefregister: true,
            resolve: {"check": loggedIn}
        }).when('/login', {
            controller: 'loginController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/login.html',
            login: true,
            index: true,
            resolve: {"check": loggedIn}
        }).when('/simplelogin', {
            controller: 'simpleLoginController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/simple-login.html',
            login: true,
            index: false,
            resolve: {"check": loggedIn}
        }).when('/reset', {
            controller: 'resetController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/reset.html',
            activetab: 'login',
            index: true,
            resolve: {"check": loggedIn}
        }).when('/confirm', {
            controller: 'confirmController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/confirm.html',
            activetab: 'login',
            index: true,
            resolve: {"check": loggedIn}
        }).when('/dishes', {
            controller: 'listDishesController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/dishes/list-dishes.html',
            activetab: 'dishes',
            index: false
        }).when('/cart', {
            controller: 'cartController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/cart/cart.html',
            activetab: 'cart',
            index: false
        }).when('/+:username', {
            controller: 'profileController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/profiles/profile.html',
            activetab: 'user',
            index: false
        }).when('/+:username/settings', {
            controller: 'settingsController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/profiles/settings.html',
            activetab: 'settings',
            index: false,
            resolve: {"check": notLoggedIn}
        }).when('/+:username/managedishes', {
            controller: 'manageDishesController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/dishes/manage-dishes.html',
            activetab: 'managedishes',
            index: false,
            resolve: {"check": notLoggedIn}
        }).when('/', {
            controller: 'indexController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/layout/index.html',
            login: false,
            index: true,
            resolve: {"check": loggedIn}
        }).otherwise('/');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage',
            function ($q, $location, $localStorage) {
                return {
                    'request': function (config) {
                        config.headers = config.headers || {};
                        if ($localStorage.token) {
                            config.headers.Authorization = 'JWT ' + $localStorage.token;
                        }
                        return config;
                    },
                    'responseError': function (response) {
                        if (response.status === 401) {
                            $location.path('/login');
                        }
                        return $q.reject(response);
                    }
                };
            }
        ]);

        function loggedIn($location, authFactory) {
            authFactory.verify().then(verifySuccessFn, verifyErrorFn);

            if (authFactory.isAuthenticated()) {
                $location.path('/dishes');
            }

            function verifySuccessFn(data, status, headers, config) {

            }

            function verifyErrorFn(data, status, headers, config) {
                authFactory.unauthenticate();
            }
        }

        function notLoggedIn($location, authFactory) {
            if (!authFactory.isAuthenticated()) {
                $location.path('/login');
            }
        }

        $mdThemingProvider.theme('default')
            .primaryPalette('orange', {'default': '700', 'hue-1': '800'})
            .warnPalette('red')
            .accentPalette('grey', {'default': '500', 'hue-1': '50'});
    }

})();