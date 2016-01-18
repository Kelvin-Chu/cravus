(function () {
    'use strict';

    angular.module('cravus.dishes').factory('dishesFactory', dishesFactory);
    dishesFactory.$inject = ['$http'];
    function dishesFactory($http) {

        function all() {
            return $http.get('/api/v1/dishes/');
        }

        function create(name, description) {
            return $http.post('/api/v1/dishes/', {
                name: name,
                description: description
            });
        }

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/dishes/');
        }

        return {
            all: all,
            create: create,
            get: get
        };
    }

})();