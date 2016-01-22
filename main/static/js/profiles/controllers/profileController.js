(function () {
    'use strict';

    angular.module('cravus.profiles').controller('profileController', profileController);
    profileController.$inject = [
        '$location',
        '$routeParams',
        'profileFactory',
        '$mdToast',
        'ytplayerFactory'
    ];
    function profileController($location, $routeParams, profileFactory, $mdToast, ytplayerFactory) {
        ytplayerFactory.stop();
        var vm = this;
        vm.profile = undefined;
        vm.dishes = [];

        activate();
        function activate() {
            var username = $routeParams.username.substr(1);

            profileFactory.get(username).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
            }

            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                $mdToast.show($mdToast.simple().textContent('That user does not exist').hideDelay(3000));
            }
        }
    }

})();