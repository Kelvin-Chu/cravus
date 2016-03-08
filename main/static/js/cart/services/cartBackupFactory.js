(function () {
    'use strict';

    angular.module('cravus.cart').factory('cartBackupFactory', cartBackupFactory);
    cartBackupFactory.$inject = ['$localStorage'];
    function cartBackupFactory($localStorage) {

        function get() {
            if ($localStorage.cart) return $localStorage.cart;
            return false;
        }

        function set(obj) {
            if (obj === undefined) delete $localStorage.cart;
            else $localStorage.cart = obj;
            return $localStorage.cart;
        }

        function empty() {
            delete $localStorage.cart;
        }

        return {
            get: get,
            set: set,
            empty: empty
        };
    }

})();