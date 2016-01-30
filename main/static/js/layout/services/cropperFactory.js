(function () {
    'use strict';

    angular.module('cravus.layout').factory('cropperFactory', cropperFactory);
    cropperFactory.$inject = ['$mdDialog'];
    function cropperFactory($mdDialog) {

        function cropper(event) {
            $mdDialog.show({
                controller: 'cropperController',
                controllerAs: 'vm',
                templateUrl: '/static/partials/layout/cropper.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true
            }).then(cropperSuccessFn, cropperErrorFn);

            function cropperSuccessFn() {

            }

            function cropperErrorFn() {

            }
        }

        return {
            cropper: cropper
        };
    }

})();