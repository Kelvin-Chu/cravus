(function () {
    'use strict';

    angular.module('cravus.dishes').factory('dishesFactory', dishesFactory);
    dishesFactory.$inject = ['$http', 'Upload'];
    function dishesFactory($http, Upload) {

        function all() {
            return $http.get('/api/v1/dishes/');
        }

        function create(newdish) {
            var fields = {
                'name': newdish.name,
                'description': newdish.description,
                'cuisine': newdish.cuisine
            };
            if (newdish.crop) {
                fields['image'] = newdish.image;
                fields['crop'] = newdish.crop;
            }
            return Upload.upload({
                url: '/api/v1/dishes/',
                method: 'POST',
                fields: fields
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