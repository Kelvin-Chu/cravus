(function () {
    'use strict';

    angular.module('cravus.dishes').controller('dishController', dishController);
    dishController.$inject = ['$location', 'dishesFactory', '$mdDialog', '$timeout'];
    function dishController($location, dishesFactory, $mdDialog, $timeout) {
        var vm = this;
        vm.loading = false;
        vm.disqus_ready = false;
        vm.disqus_id = "";
        vm.disqus_url = $location.protocol() + "://" + $location.host() + '/api/v1/dishes/' + vm.dish.id + '/';
        vm.set_ready = set_ready();
        vm.cancel = cancel;

        activate();
        function activate() {
            vm.disqus_id = vm.dish.id;
            if (vm.dish.cuisine) {
                if (vm.dish.description) {
                    vm.body = vm.dish.cuisine + " Cuisine - " + vm.dish.description
                } else {
                    vm.body = vm.dish.cuisine + " Cuisine"
                }
            } else {
                if (vm.dish.description) {
                    vm.body = "Chef choice - " + vm.dish.description
                } else {
                    vm.body = "Chef choice"
                }
            }

        }

        function cancel() {
            $mdDialog.cancel();
        }

        function set_ready() {
            vm.disqus_ready = true;
        }

    }

})();