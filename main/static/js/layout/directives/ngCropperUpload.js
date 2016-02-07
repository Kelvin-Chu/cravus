(function ($, _) {
    'use strict';

    angular.module('cravus.layout').directive('ngCropperUpload', ngCropperUpload);
    function ngCropperUpload() {
        var template = '<md-button name="vm.name" ng-model="vm.temp" accept="image/*" type="button" ' +
            'class="md-primary md-hue-1 pull-right" id="uploader" ngf-select="vm.cropper($event)">' +
            '<span class="ng-scope">Change Picture</span></md-button>';
        var controller = ['$scope', '$mdDialog', 'Upload', function ($scope, $mdDialog, Upload) {
            var vm = this;
            vm.cropper = function (event) {
                if (event.type === "change") {
                    $mdDialog.show({
                        controller: 'cropperController',
                        controllerAs: 'vm',
                        bindToController: true,
                        templateUrl: '/static/partials/layout/cropper.html',
                        parent: angular.element(document.body),
                        openFrom: "#uploader",
                        closeTo: "#uploader",
                        clickOutsideToClose: false,
                        locals: {
                            image: vm.temp
                        }
                    }).then(function (result) {
                        vm.image = result.image;
                        vm.crop = JSON.stringify(result.crop);
                        fauxCrop(result);
                    }, function () {

                    });

                }
            };
            function fauxCrop(result) {
                var container = $('#' + vm.preview);
                var originalWidth = container.outerWidth();
                var originalHeight = container.outerHeight();
                var newWidth = originalWidth;
                var newHeight = originalHeight;
                var width = result.naturalWidth;
                var height = result.naturalHeight;
                var ratio = 1;
                if (result.crop.width) {
                    ratio = originalWidth / result.crop.width;
                    newHeight = result.crop.height * ratio;
                }
                if (result.crop.height && newHeight > originalHeight) {
                    ratio = originalHeight / result.crop.height;
                    newWidth = result.crop.width * ratio;
                    newHeight = originalHeight;
                }
                container.css({
                    width: newWidth,
                    height: newHeight
                }).find('img').css({
                    width: width * ratio,
                    height: height * ratio,
                    marginLeft: -result.crop.x * ratio,
                    marginTop: -result.crop.y * ratio
                });
            }
        }];
        return {
            restrict: 'E',
            require: ['image', 'crop', 'name'],
            scope: {
                image: '=',
                crop: '=',
                preview: '@',
                name: '@'
            },
            controller: controller,
            controllerAs: 'vm',
            bindToController: true,
            template: template
        };
    }

})($, _);