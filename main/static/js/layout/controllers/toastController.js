(function () {
    'use strict';

    angular.module('cravus.layout').controller('toastController', toastController);
    toastController.$inject = ['$mdToast'];
    function toastController($mdToast) {
        var vm = this;
        vm.closeToast = closeToast;

        function closeToast() {
            $mdToast.hide();
        }
    }

})();