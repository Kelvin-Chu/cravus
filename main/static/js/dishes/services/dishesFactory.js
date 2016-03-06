(function () {
    'use strict';

    angular.module('cravus.dishes').factory('dishesFactory', dishesFactory);
    dishesFactory.$inject = ['$http', 'Upload', '$filter'];
    function dishesFactory($http, Upload, $filter) {
        var cuisines = ['American', 'Cajun', 'Chinese', 'Greek', 'Indian', 'Italian', 'Japanese', 'Korean',
            'Mediterranean', 'Mexican', 'Thai', 'Vietnamese', 'Other'];

        function all() {
            return $http.get('/api/v1/dishes/');
        }

        function create(newdish) {
            var fields = {
                'name': newdish.name,
                'description': newdish.description,
                'cuisine': newdish.cuisine,
                'price': newdish.price,
                'ingredients': JSON.stringify(newdish.ingredients)
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

        function getDish(id) {
            return $http.get('/api/v1/dishes/' + id + '/');
        }

        function updateDish(dish) {
            return $http.put('/api/v1/dishes/' + dish.id + '/', {
                name: dish.name,
                description: dish.description,
                cuisine: dish.cuisine,
                ingredients: dish.ingredients,
                price: dish.price
            });
        }

        function delDish(id) {
            return $http.delete('/api/v1/dishes/' + id + '/');
        }

        function getScheduledDishes(date, username, query, next) {
            if (next) {
                return $http.get(next);
            } else if (username) {
                return $http.get('/api/v1/accounts/' + username + '/schedule/?date=' + $filter('date')(date, "yyyy-MM-dd"));
            } else if (query) {
                return $http.get('/api/v1/schedule/search/?date=' + $filter('date')(date, "yyyy-MM-dd") + '&text=' + query);
            } else {
                return $http.get('/api/v1/schedule/?date=' + $filter('date')(date, "yyyy-MM-dd"));
            }
        }

        function schedule(dish) {
            var fields = {
                'dish': dish.id,
                'date': $filter('date')(dish.date, "yyyy-MM-dd"),
                'repeat_daily': dish.repeat_daily
            };
            return Upload.upload({
                url: '/api/v1/schedule/',
                method: 'POST',
                fields: fields
            });
        }

        function unschedule(id) {
            return $http.delete('/api/v1/schedule/' + id + '/');
        }

        return {
            cuisines: cuisines,
            all: all,
            create: create,
            get: get,
            delDish: delDish,
            getDish: getDish,
            updateDish: updateDish,
            schedule: schedule,
            getScheduledDishes: getScheduledDishes,
            unschedule: unschedule
        };
    }

})();