(function () {
    'use strict';

    angular.module('cravus.profiles').controller('settingsController', settingsController);
    settingsController.$inject = [
        '$location',
        '$routeParams',
        'authFactory',
        'profileFactory',
        'addressFactory',
        '$mdToast',
        'ytplayerFactory'
    ];
    function settingsController($location, $routeParams, authFactory, profileFactory, addressFactory, $mdToast, ytplayerFactory) {
        ytplayerFactory.stop();
        var vm = this;
        vm.destroy = destroy;
        vm.update = update;
        vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY')
            .split(' ').map(function (state) {
                return {abbrev: state};
            });

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
                addressFactory.get(username).then(addressSuccessFn, addressErrorFn);

                function addressSuccessFn(data, status, headers, config) {
                    vm.address = data.data[0];
                }

                function addressErrorFn(data, status, headers, config) {
                    $mdToast.show($mdToast.simple().textContent('Could not retrieve address information.').hideDelay(3000));
                }
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
            addressFactory.update(vm.address);

            function profileSuccessFn(data, status, headers, config) {
                authFactory.setAuthenticatedAccount(data.data);
                $mdToast.show($mdToast.simple().textContent('Your profile has been updated.').hideDelay(3000));
            }

            function profileErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('There was an error processing your request.').hideDelay(3000));
            }
        }
    }

})();