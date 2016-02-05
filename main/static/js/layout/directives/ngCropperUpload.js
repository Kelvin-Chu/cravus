(function () {
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
                    });
                    //vm.ngModel = ''; //test to see if changing this ngmodel changes the caller's ngmodel
                }
            };
        }];
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                name: '@'
            },
            controller: controller,
            controllerAs: 'vm',
            bindToController: true,
            template: template
        };
    }

})();