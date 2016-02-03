(function () {
    'use strict';

    angular.module('cravus.layout').directive('ngcropper', ngcropper);
    function ngcropper() {
        var template = '<md-button name="vm.name" ng-model="vm.temp" accept="image/*" type="button"' +
            'class="md-primary md-hue-1 pull-right" ngf-select="vm.cropper($event)"' +
            '><span class="ng-scope">Change Picture</span></md-button>';
        var controller = ['$scope', '$mdDialog', function ($scope, $mdDialog) {
            var vm = this;
            vm.out = vm.ngModel;
            vm.cropper = function (event) {
                $mdDialog.show({
                    controller: 'cropperController',
                    controllerAs: 'vm',
                    bindToController: true,
                    templateUrl: '/static/partials/layout/cropper.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    locals: {
                        image: vm.temp
                    }
                });
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