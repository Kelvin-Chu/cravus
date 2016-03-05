(function () {
    'use strict';

    angular.module('cravus.dishes').controller('dishController', dishController);
    dishController.$inject = ['$rootScope', '$location', 'dishesFactory', '$mdDialog'];
    function dishController($rootScope, $location, dishesFactory, $mdDialog) {
        var vm = this;
        vm.loading = false;
        vm.disqus_ready = false;
        vm.cancel = cancel;

        activate();
        function activate() {
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
            vm.disqusConfig = {
                disqus_shortname: 'cravus',
                disqus_identifier: "dish" + vm.dish.id,
                disqus_url: $location.protocol() + "://" + $location.host() + '/dishes?dish=' + vm.dish.id,
                disqus_title: vm.dish.name,
                disqus_remote_auth_s3: $rootScope.disqusPayload,
                disqus_api_key: $rootScope.disqusPublic,
                disqus_on_ready: set_ready()
            };
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function set_ready() {
            vm.disqus_ready = true;
        }

    }

})();