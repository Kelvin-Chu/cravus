(function () {
    'use strict';

    angular.module('cravus.profiles').controller('settingsController', settingsController);
    settingsController.$inject = ['$rootScope',
        '$location',
        '$routeParams',
        'authFactory',
        'profileFactory',
        '$mdToast',
        'ytplayerFactory'
    ];
    function settingsController($rootScope, $location, $routeParams, authFactory, profileFactory, $mdToast, ytplayerFactory) {
        $rootScope.bgimg = 'static/img/bg2.jpg';
        $rootScope.hideHeader = false;
        ytplayerFactory.play();
        var vm = this;
        vm.destroy = destroy;
        vm.update = update;

        activate();
        function activate() {
            var authenticatedAccount = authFactory.getAuthenticatedAccount();
            var username = $routeParams.username.substr(1);

            if (!authenticatedAccount) {
                $location.url('/login');
                $mdToast.show($mdToast.simple().textContent('You must log in to view this page.').hideDelay(3000));
            } else {
                if (authenticatedAccount.username !== username) {
                    $location.url('/');
                    $mdToast.show($mdToast.simple().textContent('You are not authorized to view this page.').hideDelay(3000));
                }
            }

            profileFactory.get(username).then(profileSuccessFn, profileErrorFn);
            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
            }
            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                $mdToast.show($mdToast.simple().textContent('You are not authorized to view this page.').hideDelay(3000));
            }
        }

        function destroy() {
            profileFactory.destroy(vm.profile.username).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                authFactory.unauthenticate();
                window.location = '/';
                $mdToast.show($mdToast.simple().textContent('Your account has been deleted.').hideDelay(3000));
            }

            function profileErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('There was an error processing your request.').hideDelay(3000));
            }
        }

        function update() {
            profileFactory.update(vm.profile).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('Your profile has been updated.').hideDelay(3000));
            }

            function profileErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('There was an error processing your request.').hideDelay(3000));
            }
        }
    }

})();