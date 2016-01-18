(function () {
    'use strict';

    angular.module('cravus.profiles').factory('profileFactory', profileFactory);
    profileFactory.$inject = ['$location', '$http', 'authFactory'];
    function profileFactory($location, $http, authFactory) {

        function destroy(profile) {
            return $http.delete('/api/v1/accounts/' + profile.id + '/')
                .then(destroySuccessFn, destroyErrorFn);

            function destroySuccessFn(data, status, headers, config) {
                authFactory.unauthenticate();
                $location.url('/');
            }

            function destroyErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
            }
        }

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/');
        }

        function update(profile) {
            return $http.put('/api/v1/accounts/' + profile.username + '/', profile)
                .then(updateSuccessFn, updateErrorFn);

            function updateSuccessFn(data, status, headers, config) {
                authFactory.setAuthenticatedAccount(data.data);
            }

            function updateErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
            }
        }

        return {
            destroy: destroy,
            get: get,
            update: update
        };
    }

})();