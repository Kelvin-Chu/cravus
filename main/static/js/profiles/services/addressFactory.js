(function () {
    'use strict';

    angular.module('cravus.profiles').factory('addressFactory', addressFactory);
    addressFactory.$inject = ['$http'];
    function addressFactory($http) {

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/addresses/');
        }

        function update(address) {
            return $http.put('/api/v1/addresses/' + address.id + '/', address);
        }

        return {
            get: get,
            update: update
        };
    }

})();