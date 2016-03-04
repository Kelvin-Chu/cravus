(function () {
    'use strict';

    angular.module('cravus.profiles').controller('settingsController', settingsController);
    settingsController.$inject = ['$rootScope', '$location', '$routeParams', 'authFactory', 'profileFactory',
        'addressFactory', 'chefFactory', 'dishesFactory', 'ytplayerFactory'];
    function settingsController($rootScope, $location, $routeParams, authFactory, profileFactory,
                                addressFactory, chefFactory, dishesFactory, ytplayerFactory) {
        var vm = this;
        vm.destroy = destroy;
        vm.update = update;
        vm.profile = {};
        vm.chef = {};
        vm.address = {};
        vm.formErrors = {};
        vm.errors = {};
        vm.loading = false;
        vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY')
            .split(' ').map(function (state) {
                return {abbrev: state};
            });
        vm.types = ['Homemade', 'Fast Food', 'Food Truck', 'Restaurant', 'Other'];
        vm.cuisines = dishesFactory.cuisines;

        activate();
        function activate() {
            $rootScope.title = "Account Settings";
            $rootScope.loading = true;
            ytplayerFactory.stop();
            var username = $routeParams.username.substr(1);
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
            if ($rootScope.authenticatedAccount) {
                if ($rootScope.authenticatedAccount.username !== username) {
                    toast('error', '#globalToast', 'You are not authorized to view this page.', 'none');
                    $location.url('/dishes');
                }
            }

            profileFactory.get(username).then(profileGetSuccessFn, profileGetErrorFn);
            addressFactory.get(username).then(addressGetSuccessFn, addressGetErrorFn);

            function profileGetSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
                if (vm.profile.is_chef) {
                    chefFactory.get(username).then(chefGetSuccessFn, chefGetErrorFn);
                }

                function chefGetSuccessFn(data, status, headers, config) {
                    $rootScope.loading = false;
                    vm.chef = data.data;
                }

                function chefGetErrorFn(data, status, headers, config) {
                    $rootScope.loading = false;
                    toast('warning', '#toastBounds', 'Could not retrieve chef information.');
                }
            }

            function profileGetErrorFn(data, status, headers, config) {
                $rootScope.loading = false;
                toast('warning', '#toastBounds', 'Could not retrieve profile information.');
                $location.url('/dishes');
            }

            function addressGetSuccessFn(data, status, headers, config) {
                vm.address = data.data[0];
            }

            function addressGetErrorFn(data, status, headers, config) {
                toast('warning', '#toastBounds', 'Could not retrieve address information.');
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
                toast('error', '#toastBounds', 'There was an error processing your request.  Please double check your settings.', 'none');
            }
        }

        function update(event) {
            vm.loading = true;
            profileFactory.update(vm.profile).then(profileUpdateSuccessFn, profileUpdateErrorFn);
            addressFactory.update(vm.address);

            if (vm.profile.is_chef) {
                chefFactory.update(vm.chef);
            }

            function profileUpdateSuccessFn(data) {
                authFactory.setAuthenticatedAccount(data.data);
                clearErrors(vm);
                toast('success', '#toastBounds', 'Your profile has been updated.', 'none');
                vm.loading = false;
            }

            function profileUpdateErrorFn(data) {
                clearErrors(vm);
                setErrors(vm, data);
                toast('error', '#toastBounds', 'There was an error processing your request.  Please double check your settings.', 'none');
                vm.loading = false;
            }
        }
    }

})();