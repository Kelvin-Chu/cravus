(function () {
    'use strict';

    angular.module('cravus.dishes').controller('dishDetailsController', dishDetailsController);
    dishDetailsController.$inject = ['$rootScope', '$location', '$mdDialog'];
    function dishDetailsController($rootScope, $location, $mdDialog) {
        var vm = this;
        vm.loading = false;
        vm.disqus_ready = false;
        vm.cancel = cancel;
        vm.fab = false;

        activate();
        function activate() {
            if (vm.dish.cuisine) {
                if (vm.dish.description) {
                    vm.body = vm.dish.cuisine + " Cuisine - " + vm.dish.description
                } else {
                    vm.body = vm.dish.cuisine + " Cuisine - No Description"
                }
            } else {
                if (vm.dish.description) {
                    vm.body = "Original Cuisine - " + vm.dish.description
                } else {
                    vm.body = "Original Cuisine - No Description"
                }
            }
            if (vm.dish.ingredients.length > 0) {
                vm.ingredients = "Ingredients: " + vm.dish.ingredients.join(", ");
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