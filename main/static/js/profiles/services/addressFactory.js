(function () {
    'use strict';

    angular.module('cravus.profiles').factory('addressFactory', addressFactory);
    addressFactory.$inject = ['$location', '$http', 'authFactory'];
    function addressFactory($location, $http, authFactory) {

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