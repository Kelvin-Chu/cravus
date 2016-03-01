(function () {
    'use strict';

    angular.module('cravus.dishes').controller('dishController', dishController);
    dishController.$inject = ['$location', 'dishesFactory', '$mdDialog', '$timeout'];
    function dishController($location, dishesFactory, $mdDialog, $timeout) {
        var vm = this;
        vm.loading = false;
        vm.disqus_ready = false;
        vm.disqus_id = "";
        vm.disqus_url = $location.absUrl() + '/' + vm.dish.id + '/';
        vm.set_ready = set_ready();
        vm.cancel = cancel;

        activate();
        function activate() {
            vm.disqus_id = vm.dish.id;
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function set_ready() {
            $timeout(function () {
                vm.disqus_ready = true;
            }, 1000);
        }

    }

})();