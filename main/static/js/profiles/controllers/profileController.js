(function () {
    'use strict';

    angular.module('cravus.profiles').controller('profileController', profileController);
    profileController.$inject = ['$rootScope', '$location', '$routeParams', 'dishesFactory', 'profileFactory',
        'addressFactory', '$mdToast', 'ytplayerFactory'];
    function profileController($rootScope, $location, $routeParams, dishesFactory, profileFactory, addressFactory,
                               $mdToast, ytplayerFactory) {
        ytplayerFactory.stop();
        var vm = this;
        vm.loading = true;
        vm.profile = {};
        vm.dishes = [];
        vm.address = [];
        vm.myProfile = false;
        vm.reviewed = false; //need to be worked on

        activate();
        function activate() {
            var username = $routeParams.username.substr(1);

            profileFactory.get(username).then(profileSuccessFn, profileErrorFn);
            dishesFactory.get(username).then(dishesSuccessFn, dishesErrorFn);
            addressFactory.get(username).then(addressSuccessFn, addressErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
                if ($rootScope.isAuthenticated) {
                    if ($rootScope.authenticatedAccount.username == vm.profile.username) {
                        vm.myProfile = true;
                    }
                }
                vm.loading = false;
            }

            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                $mdToast.show($mdToast.simple().textContent('User does not exist.').hideDelay(3000));

            }

            function dishesSuccessFn(data, status, headers, config) {
                vm.dishes = data.data;
            }

            function dishesErrorFn(data, status, headers, config) {

            }

            function addressSuccessFn(data, status, headers, config) {
                vm.address = data.data[0];
            }

            function addressErrorFn(data, status, headers, config) {

            }
        }
    }

})();