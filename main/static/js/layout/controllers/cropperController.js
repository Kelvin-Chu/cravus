(function () {
    'use strict';

    angular.module('cravus.layout').controller('cropperController', cropperController);
    cropperController.$inject = ['$scope', '$mdDialog', 'image', 'Upload', '$timeout'];
    function cropperController($scope, $mdDialog, image, Upload, $timeout) {
        var vm = this;
        var cropped;
        vm.cancel = cancel;
        vm.crop = crop;
        vm.showEvent = 'show';
        vm.hideEvent = 'hide';
        vm.loading = true;
        vm.cropperProxy = 'vm.cropper.first';
        vm.cropper = {};
        vm.options = {
            autoCropArea: 0.60,
            minCropBoxWidth: 100,
            aspectRatio: 1,
            viewMode: 1,
            crop: function (dataNew) {
                cropped = dataNew;
            }
        };

        Upload.resize(image, 1024, 768).then(
            Upload.dataUrl(image, true)['finally'](function () {
                $timeout(function () {
                    vm.image = image.$ngfDataUrl;
                    $timeout(showCropper);
                });
            }));

        $scope.$watchCollection('vm.cropper', function () {
            if (vm.cropper.first) {
                vm.loading = false;
                console.log(vm.cropper.first("getData"));
            }
        });

        function cancel() {
            hideCropper();
            $mdDialog.cancel();
        }

        function crop() {
            hideCropper();
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