(function () {
    'use strict';

    angular.module('cravus.profiles').factory('chefFactory', chefFactory);
    chefFactory.$inject = ['$http'];
    function chefFactory($http) {

        function get(username) {
            return $http.get('/api/v1/chef/' + username + '/');
        }

        function update(chef) {
            return $http.put('/api/v1/chef/' + chef.account + '/', chef);
        }

        return {
            get: get,
            update: update
        };
    }

})();