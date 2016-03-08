(function () {
    'use strict';

    angular.module('cravus.cart').factory('cartFactory', cartFactory);
    cartFactory.$inject = ['cartItemFactory', 'cartBackupFactory'];
    function cartFactory(cartItemFactory, cartBackupFactory) {
        var _cart = {
            shipping: null,
            taxRate: null,
            tax: null,
            items: []
        };

        function init() {
            var backup = cartBackupFactory.get();
            if (backup) restore(backup);
            return _cart;
        }

        function addItem(id, name, price, quantity, date, time, data) {
            var alreadyInCart = getItemById(id);
            if (typeof alreadyInCart === 'object') {
                alreadyInCart.setQuantity(quantity, true);
            } else {
                var newItem = new cartItemFactory(id, name, price, quantity, date, time, data);
                _cart.items.push(newItem);
            }
            save();
        }

        function getItemById(itemId) {
            var items = getItems();
            var found = false;
            angular.forEach(items, function (item) {
                if (item.getId() === itemId) found = item;
            });
            return found;
        }

        function getItemsByDate(date) {
            var items = getItems();
            var result = [];
            angular.forEach(items, function (item) {
                if (item.getDate() === date) result.push(item);
            });
            return result;
        }

        function setShipping(shipping) {
            _cart.shipping = shipping;
            return getShipping();
        }

        function getShipping() {
            if (_cart.items.length == 0) return 0;
            return _cart.shipping;
        }

        function setTaxRate(taxRate) {
            _cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return getTaxRate();
        }

        function getTaxRate() {
            return _cart.taxRate
        }

        function getTax() {
            return +parseFloat(((getSubTotal() / 100) * _cart.taxRate )).toFixed(2);
        }

        function setCart(cart) {
            _cart = cart;
            return _cart;
        }

        function getCart() {
            return _cart;
        }

        function getItems() {
            return _cart.items;
        }

        function getTotalItems() {
            var count = 0;
            var items = getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        }

        function getTotalUniqueItems() {
            return _cart.items.length;
        }

        function getSubTotal() {
            var total = 0;
            angular.forEach(_cart.items, function (item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        }

        function totalCost() {
            return +parseFloat(getSubTotal() + getShipping() + getTax()).toFixed(2);
        }

        function removeItem(index) {
            _cart.items.splice(index, 1);
            save();
        }

        function removeItemById(id) {
            var cart = _cart;
            angular.forEach(cart.items, function (item, index) {
                if (item.getId() === id) {
                    cart.items.splice(index, 1);
                }
            });
            setCart(cart);
            save();
        }

        function empty() {
            _cart.items = [];
            cartBackupFactory.empty();
        }

        function isEmpty() {
            return (_cart.items.length <= 0);
        }

        function toObject() {
            if (getItems().length === 0) return false;
            var items = [];
            angular.forEach(getItems(), function (item) {
                items.push(item.toObject());
            });
            return {
                shipping: getShipping(),
                tax: getTax(),
                taxRate: getTaxRate(),
                subTotal: getSubTotal(),
                totalCost: totalCost(),
                items: items
            }
        }

        function restore(cart) {
            _cart = {
                shipping: cart.shipping,
                taxRate: cart.taxRate,
                tax: cart.tax,
                items: []
            };
            angular.forEach(cart.items, function (item) {
                _cart.items.push(new cartItemFactory(item._id, item._name, item._price, item._quantity, item._date, item._time, item._data));
            });
            return _cart
        }

        function save() {
            return cartBackupFactory.set(_cart);
        }

        return {
            init: init,
            addItem: addItem,
            getItemById: getItemById,
            getItemsByDate: getItemsByDate,
            setShipping: setShipping,
            getShipping: getShipping,
            setTaxRate: setTaxRate,
            getTaxRate: getTaxRate,
            getTax: getTax,
            setCart: setCart,
            getCart: getCart,
            getItems: getItems,
            getTotalItems: getTotalItems,
            getTotalUniqueItems: getTotalUniqueItems,
            getSubTotal: getSubTotal,
            totalCost: totalCost,
            removeItem: removeItem,
            removeItemById: removeItemById,
            empty: empty,
            isEmpty: isEmpty,
            toObject: toObject,
            restore: restore,
            save: save
        };
    }

})();