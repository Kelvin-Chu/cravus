(function () {
    'use strict';

    angular.module('cravus.profiles').factory('profileFactory', profileFactory);
    profileFactory.$inject = ['$location', '$http', 'authFactory', 'Upload'];
    function profileFactory($location, $http, authFactory, Upload) {

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
            delete profile['avatar'];
            //console.log(profile['avatar']);
            //profile.crop = '{"x": 0, "y": 0, "height": 500, "width": 500}';
            //console.log(profile);
            return Upload.upload({
                url: '/api/v1/accounts/' + profile.username + '/',
                method: 'PUT',
                fields: {
                    'first_name': profile.first_name,
                    'last_name': profile.last_name,
                    'email': profile.email,
                    'username': profile.username,
                    'avatar': profile.avatar,
                    'crop': profile.crop
                }
            });
        }

        return {
            destroy: destroy,
            get: get,
            update: update
        };
    }

})();