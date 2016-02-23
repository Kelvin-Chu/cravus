(function () {
    'use strict';

    angular.module('cravus.layout').controller('cropperController', cropperController);
    cropperController.$inject = ['$scope', '$mdDialog', 'image', 'ratio', 'Upload', '$timeout'];
    function cropperController($scope, $mdDialog, image, ratio, Upload, $timeout) {
        var vm = this;
        var cropData;
        vm.cancel = cancel;
        vm.crop = crop;
        vm.showEvent = 'show';
        vm.hideEvent = 'hide';
        vm.loading = true;
        vm.filename = image.name;
        vm.cropperProxy = 'vm.cropper.first';
        vm.cropper = {};
        vm.options = {
            autoCropArea: 0.60,
            minCropBoxWidth: 50,
            minCropBoxHeight: 50,
            aspectRatio: ratio,
            viewMode: 1,
            dragMode: 'move',
            rotatable: false,
            crop: function (dataNew) {
                cropData = dataNew;
            }
        };
        Upload.applyExifRotation(image).then(function (fixedImage) {
            if (Upload.isResizeSupported()) {
                Upload.resize(fixedImage, 1024, 768).then(function (resizedImage) {
                    Upload.dataUrl(resizedImage, true)['finally'](function () {
                        $timeout(function () {
                            vm.image = resizedImage.$ngfDataUrl;
                            $timeout(showCropper);
                        });
                    });
                });
            } else {
                Upload.dataUrl(fixedImage, true)['finally'](function () {
                    $timeout(function () {
                        vm.image = fixedImage.$ngfDataUrl;
                        $timeout(showCropper);
                    });
                });
            }
        });

        $scope.$watchCollection('vm.cropper', function () {
            if (vm.cropper.first) {
                vm.loading = false;
            }
        });

        function showCropper() {
            $scope.$broadcast(vm.showEvent);
        }

        function hideCropper() {
            $scope.$broadcast(vm.hideEvent);
        }

        function cancel() {
            hideCropper();
            $mdDialog.cancel();
        }

        function crop() {
            var imageData = vm.cropper.first("getImageData");
            cropData.image = Upload.dataUrltoBlob(vm.image, vm.filename);
            cropData.crop = vm.cropper.first("getData");
            cropData.naturalHeight = imageData.naturalHeight;
            cropData.naturalWidth = imageData.naturalWidth;
            hideCropper();
            $mdDialog.hide(cropData);
        }
    }

})();