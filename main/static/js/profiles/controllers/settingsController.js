(function () {
    'use strict';

    angular.module('cravus.profiles').controller('settingsController', settingsController);
    settingsController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'authFactory', 'profileFactory',
        'addressFactory', '$mdToast', 'ytplayerFactory', 'cropperFactory'];
    function settingsController($rootScope, $scope, $location, $routeParams, authFactory, profileFactory,
                                addressFactory, $mdToast, ytplayerFactory, cropperFactory) {
        var vm = this;
        vm.scope = $scope;
        vm.destroy = destroy;
        vm.update = update;
        vm.formErrors = {};
        vm.non_field_errors = {};
        vm.cropper = cropperFactory.cropper;
        vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY')
            .split(' ').map(function (state) {
                return {abbrev: state};
            });

        activate();
        function activate() {
            var username = $routeParams.username.substr(1);
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
            if ($rootScope.authenticatedAccount) {
                if ($rootScope.authenticatedAccount.username !== username) {
                    $location.url('/dishes');
                    $mdToast.show($mdToast.simple().textContent('You are not authorized to view this page.').hideDelay(3000));
                }
                ytplayerFactory.stop();
            }

            profileFactory.get(username).then(profileGetSuccessFn, profileGetErrorFn);
            function profileGetSuccessFn(data, status, headers, config) {
                vm.profile = data.data;

                addressFactory.get(username).then(addressGetSuccessFn, addressGetErrorFn);

                function addressGetSuccessFn(data, status, headers, config) {
                    vm.address = data.data[0];
                }

                function addressGetErrorFn(data, status, headers, config) {
                    $mdToast.show($mdToast.simple().textContent('Could not retrieve address information.').hideDelay(3000));
                }
            }

            function profileGetErrorFn(data, status, headers, config) {
                $location.url('/');
                $mdToast.show($mdToast.simple().textContent('You are not authorized to view this page.').hideDelay(3000));
            }
        }

        function destroy() {
            profileFactory.destroy(vm.profile.username).then(profileDelSuccessFn, profileDelErrorFn);

            function profileDelSuccessFn(data, status, headers, config) {
                authFactory.unauthenticate();
                $location.url('/');
                $mdToast.show($mdToast.simple().textContent('Your account has been deleted.').hideDelay(3000));
            }

            function profileDelErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('There was an error processing your request.').hideDelay(3000));
            }
        }

        function update() {
            profileFactory.update(vm.profile).then(profileUpdateSuccessFn, profileUpdateErrorFn);
            addressFactory.update(vm.address);

            function profileUpdateSuccessFn(data, status, headers, config) {
                authFactory.setAuthenticatedAccount(data.data);
                clearErrors(vm);
                $mdToast.show($mdToast.simple().textContent('Your profile has been updated.').hideDelay(3000));
            }

            function profileUpdateErrorFn(data, status, headers, config) {
                setErrors(vm, data);
                $mdToast.show($mdToast.simple().textContent('There was an error processing your request.').hideDelay(3000));
            }
        }
    }

})();