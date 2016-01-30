(function () {
    'use strict';

    angular.module('cravus.layout').controller('cropperController', cropperController);
    cropperController.$inject = ['$mdDialog'];
    function cropperController($mdDialog) {
        var vm = this;
        vm.hide = hide;
        vm.cancel = cancel;
        vm.answer = answer;

        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function answer(answer) {
            $mdDialog.hide(answer);
        }
    }

})();