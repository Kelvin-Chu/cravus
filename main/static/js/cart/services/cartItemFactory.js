(function () {
    'use strict';

    angular.module('cravus.cart').factory('cartItemFactory', cartItemFactory);
    cartItemFactory.$inject = ['$log'];
    function cartItemFactory($log) {
        var item = function (id, name, price, quantity, date, time, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setDate(date);
            this.setTime(time);
            this.setData(data);
        };

        item.prototype.setId = function (id) {
            if (id)  this._id = id;
            else $log.error('An ID must be provided');
        };

        item.prototype.getId = function () {
            return this._id;
        };

        item.prototype.setName = function (name) {
            if (name)  this._name = name;
            else $log.error('A name must be provided');
        };

        item.prototype.getDate = function () {
            return this._date;
        };

        item.prototype.setDate = function (date) {
            if (date)  this._date = date;
            else $log.error('A date must be provided');
        };

        item.prototype.getTime = function () {
            return this._time;
        };

        item.prototype.setTime = function (time) {
            if (time)  this._time = time;
        };

        item.prototype.getName = function () {
            return this._name;
        };

        item.prototype.setPrice = function (price) {
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat < 0) {
                    this._price = parseFloat('0.00');
                }
                else this._price = priceFloat;
            } else {
                this._price = parseFloat('0.00');
            }
        };

        item.prototype.getPrice = function () {
            return this._price;
        };

        item.prototype.setQuantity = function (quantity, relative) {
            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0) {
                if (relative === true) this._quantity += quantityInt;
                else this._quantity = quantityInt;
                if (this._quantity < 1) this._quantity = 1;
            } else {
                this._quantity = 1;
            }
        };

        item.prototype.getQuantity = function () {
            return this._quantity;
        };

        item.prototype.setData = function (data) {
            if (data) this._data = data;
        };

        item.prototype.getData = function () {
            if (this._data) return this._data;
            else return null;
        };

        item.prototype.getTotal = function () {
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function () {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                date: this.getDate(),
                time: this.getTime(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }

})();