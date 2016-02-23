(function () {
    'use strict';

    angular.module('cravus.profiles').controller('profileController', profileController);
    profileController.$inject = ['$rootScope', '$location', '$routeParams', 'dishesFactory', 'profileFactory',
        'addressFactory', 'chefFactory', 'ytplayerFactory'];
    function profileController($rootScope, $location, $routeParams, dishesFactory, profileFactory, addressFactory,
                               chefFactory, ytplayerFactory) {
        ytplayerFactory.stop();
        var vm = this;
        vm.profile = null;
        vm.dishes = null;
        vm.address = null;
        vm.name = "";
        vm.loading = true;
        vm.myProfile = false;
        vm.reviewed = false; //need to be worked on

        activate();
        function activate() {
            var username = $routeParams.username.substr(1);

            profileFactory.get(username).then(profileSuccessFn, profileErrorFn);
            dishesFactory.get(username).then(dishesSuccessFn, dishesErrorFn);
            addressFactory.get(username).then(addressSuccessFn, addressErrorFn);
            chefFactory.get(username).then(chefSuccessFn, chefErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                if (!data.data.is_chef) {
                    $location.url('/dishes');
                    toast('error', '#globalToast', 'User is not a chef.', 'none');
                }
                vm.profile = data.data;
                if ($rootScope.isAuthenticated) {
                    if ($rootScope.authenticatedAccount.username == vm.profile.username) {
                        vm.myProfile = true;
                    }
                }
                if (vm.profile.first_name || vm.profile.last_name) {
                    if (vm.profile.first_name) {
                        vm.name = "Chef " + vm.profile.first_name + " " + vm.profile.last_name;
                    } else {
                        vm.name = "Chef " + vm.profile.last_name;
                    }

                } else {
                    if (vm.myProfile) {
                        vm.name = "Your Name";
                    } else {
                        vm.name = "Anonymous Chef";
                    }
                }
                angular.element(document).ready(function () {
                    vm.loading = false;
                });
            }

            function profileErrorFn(data, status, headers, config) {
                $location.url('/dishes');
                toast('error', '#globalToast', 'User does not exist.', 'none');
            }

            function dishesSuccessFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.dishes = data.data;
                } else {
                    vm.dishes = false;
                }
            }

            function dishesErrorFn(data, status, headers, config) {

            }

            function addressSuccessFn(data, status, headers, config) {
                vm.address = data.data[0];
            }

            function addressErrorFn(data, status, headers, config) {

            }

            function chefSuccessFn(data, status, headers, config) {
                vm.chef = data.data;
                if (vm.myProfile && !vm.chef.tagline) {
                    vm.tagline = "Your Tagline";
                } else {
                    vm.tagline = vm.chef.tagline;
                }
                if (vm.myProfile && !vm.chef.bio) {
                    vm.bio = "A short description about yourself or your kitchen goes here.";
                } else {
                    vm.bio = vm.chef.bio;
                }
            }

            function chefErrorFn(data, status, headers, config) {

            }
        }
    }

})();