(function () {
    'use strict';

    angular.module('cravus.profiles').controller('settingsController', settingsController);
    settingsController.$inject = ['$rootScope', '$location', '$routeParams', 'authFactory', 'profileFactory',
        'addressFactory', 'ytplayerFactory'];
    function settingsController($rootScope, $location, $routeParams, authFactory, profileFactory,
                                addressFactory, ytplayerFactory) {
        var vm = this;
        vm.destroy = destroy;
        vm.update = update;
        vm.formErrors = {};
        vm.errors = {};
        vm.loading = false;
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
                    toast('error', '#globalToast', 'You are not authorized to view this page.', 'none');
                    $location.url('/dishes');
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
                    toast('warning', '#toastBounds', 'Could not retrieve address information.');
                }
            }

            function profileGetErrorFn(data, status, headers, config) {
                toast('warning', '#toastBounds', 'Could not retrieve profile information.');
                $location.url('/dishes');
            }
        }

        function destroy() {
            profileFactory.destroy(vm.profile.username).then(profileDelSuccessFn, profileDelErrorFn);

            function profileDelSuccessFn(data, status, headers, config) {
                authFactory.unauthenticate();
                toast('info', '#globalToast', 'Your account has been deleted.');
                $location.url('/');
            }

            function profileDelErrorFn(data, status, headers, config) {
                toast('error', '#toastBounds', 'There was an error processing your request.', 'none');
            }
        }

        function update(event) {
            vm.loading = true;
            profileFactory.update(vm.profile).then(profileUpdateSuccessFn, profileUpdateErrorFn, profileUpdateProgFn);
            addressFactory.update(vm.address);

            function profileUpdateSuccessFn(data) {
                authFactory.setAuthenticatedAccount(data.data);
                clearErrors(vm);
                toast('success', '#toastBounds', 'Your profile has been updated.', 'none');
                vm.loading = false;
            }

            function profileUpdateErrorFn(data) {
                clearErrors(vm);
                setErrors(vm, data);
                toast('error', '#toastBounds', 'There was an error processing your request.', 'none');
                vm.loading = false;
            }

            function profileUpdateProgFn(data) {

            }
        }
    }

})();