(function () {
    'use strict';

    angular.module('cravus.layout').controller('cropperController', cropperController);
    cropperController.$inject = ['$mdDialog', 'image'];
    function cropperController($mdDialog, image) {
        var vm = this;
        vm.hide = hide;
        vm.cancel = cancel;
        vm.answer = answer;
        console.log(image);

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