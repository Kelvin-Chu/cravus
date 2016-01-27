(function () {
    'use strict';

    angular.module('cravus.profiles').controller('profileController', profileController);
    profileController.$inject = [
        '$location',
        '$routeParams',
        'dishesFactory',
        'profileFactory',
        'authFactory',
        '$mdToast',
        'ytplayerFactory'
    ];
    function profileController($location,
                               $routeParams,
                               dishesFactory,
                               profileFactory,
                               authFactory,
                               $mdToast,
                               ytplayerFactory) {
        ytplayerFactory.stop();
        var vm = this;
        vm.profile = undefined;
        vm.dishes = [];
        vm.myProfile = false;

        activate();
        function activate() {
            var username = $routeParams.username.substr(1);

            profileFactory.get(username).then(profileSuccessFn, profileErrorFn);
            dishesFactory.get(username).then(dishesSuccessFn, dishesErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
                console.log(vm.profile);
                if (authFactory.getAuthenticatedAccount().username == vm.profile.username) {
                    vm.myProfile = true;
                    console.log('success');
                }
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
        }
    }

})();