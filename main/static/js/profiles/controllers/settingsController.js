(function () {
    'use strict';

    angular.module('cravus.profiles').controller('settingsController', settingsController);
    settingsController.$inject = ['$rootScope',
        '$location',
        '$routeParams',
        'authFactory',
        'profileFactory',
        'snackbarFactory',
        'ytplayerFactory'
    ];
    function settingsController($rootScope, $location, $routeParams, authFactory, profileFactory, snackbarFactory, ytplayerFactory) {
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
                snackbarFactory.error('You must log in to view this page.');
            } else {
                if (authenticatedAccount.username !== username) {
                    $location.url('/');
                    snackbarFactory.error('You are not authorized to view this page.');
                }
            }

            profileFactory.get(username).then(profileSuccessFn, profileErrorFn);
            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
            }
            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                snackbarFactory.error('You are not authorized to view this page.');
            }
        }

        function destroy() {
            profileFactory.destroy(vm.profile.username).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                authFactory.unauthenticate();
                window.location = '/';

                snackbarFactory.show('Your account has been deleted.');
            }

            function profileErrorFn(data, status, headers, config) {
                snackbarFactory.error(data.error);
            }
        }

        function update() {
            profileFactory.update(vm.profile).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                snackbarFactory.show('Your profile has been updated.');
            }

            function profileErrorFn(data, status, headers, config) {
                snackbarFactory.error(data.error);
            }
        }
    }

})();