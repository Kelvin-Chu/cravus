(function () {
    'use strict';

    angular.module('cravus').config(config);
    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$mdThemingProvider'];
    function config($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider) {
        $routeProvider.when('/register', {
            controller: 'registerController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/register.html',
            activetab: 'register'
        }).when('/login', {
            controller: 'loginController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/authentication/login.html',
            activetab: 'login'
        }).when('/dishes', {
            controller: 'listDishesController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/dishes/list-dishes.html',
            activetab: 'dishes'
        }).when('/+:username', {
            controller: 'profileController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/profiles/profile.html',
            activetab: 'user'
        }).when('/+:username/settings', {
            controller: 'settingsController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/profiles/settings.html',
            activetab: 'settings'
        }).when('/', {
            controller: 'indexController',
            controllerAs: 'vm',
            templateUrl: '/static/partials/layout/index.html'
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
                        if (response.status === 401 || response.status === 403) {
                            $location.path('/login');
                        }
                        return $q.reject(response);
                    }
                };
            }
        ]);
        $mdThemingProvider.theme('default').primaryPalette('orange').accentPalette('indigo');
    }

})();