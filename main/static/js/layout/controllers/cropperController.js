(function () {
    'use strict';

    angular.module('cravus.layout').controller('cropperController', cropperController);
    cropperController.$inject = ['$scope', '$mdDialog', 'image', 'Upload', '$timeout', 'Cropper'];
    function cropperController($scope, $mdDialog, image, Upload, $timeout, Cropper) {
        var vm = this;
        var cropped;
        vm.cancel = cancel;
        vm.crop = crop;
        vm.showEvent = 'show';
        vm.hideEvent = 'hide';
        vm.cropper = {};
        vm.options = {
            maximize: false,
            aspectRatio: 2 / 1,
            crop: function (dataNew) {
                cropped = dataNew;
            }
        };
        //vm.cropperProxy = 'cropper.first';
        //Upload.dataUrl(image, false)['finally'](function () {
        //    $timeout(function () {
        //        vm.image = image.$ngfBlobUrl;
        //        showCropper();
        //    });
        //});

        Cropper.encode(image).then(function (dataUrl) {
            vm.image = dataUrl;
            $timeout(showCropper);  // wait for $digest to set image's src
        });

        function cancel() {
            $mdDialog.cancel();
        }

        function crop() {
            $mdDialog.hide();
        }

        function showCropper() {
            $scope.$broadcast(vm.showEvent);
        }

        function hideCropper() {
            $scope.$broadcast(vm.hideEvent);
        }
    }

})();