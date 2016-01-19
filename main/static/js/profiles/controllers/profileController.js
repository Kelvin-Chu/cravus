(function () {
    'use strict';

    angular.module('cravus.profiles').controller('profileController', profileController);
    profileController.$inject = [
        '$rootScope',
        '$location',
        '$routeParams',
        'profileFactory',
        'snackbarFactory',
        'ytplayerFactory'
    ];
    function profileController($rootScope, $location, $routeParams, profileFactory, snackbarFactory, ytplayerFactory) {
        $rootScope.bgimg = 'static/img/bg2.jpg';
        $rootScope.hideHeader = false;
        ytplayerFactory.play();
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
                snackbarFactory.error('That user does not exist.');
            }
        }
    }

})();