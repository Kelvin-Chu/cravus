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
            var fields = {
                'first_name': profile.first_name,
                'last_name': profile.last_name,
                'mobile': profile.mobile,
                'email': profile.email,
                'username': profile.username,
                'password': profile.password,
                'password_confirm': profile.password_confirm
            };
            if (profile.crop) {
                fields['avatar'] = profile.avatar;
                fields['crop'] = profile.crop;
            }
            return Upload.upload({
                url: '/api/v1/accounts/' + profile.username + '/',
                method: 'PUT',
                fields: fields
            });
        }

        return {
            destroy: destroy,
            get: get,
            update: update
        };
    }

})();