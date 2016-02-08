(function () {
    'use strict';

    angular.module('cravus.layout')
        .directive('ngCropper', ['$q', '$parse', function ($q, $parse) {
            return {
                restrict: 'A',
                scope: {
                    options: '=ngCropperOptions',
                    proxy: '=ngCropperProxy',
                    showEvent: '=ngCropperShow',
                    hideEvent: '=ngCropperHide'
                },
                link: function (scope, element, atts) {
                    var shown = false;

                    scope.$on(scope.showEvent, function () {
                        if (shown) return;
                        shown = true;
                        var options = scope.options || {};
                        element.cropper(options);
                        setProxy(element);
                    });

                    function setProxy(element) {
                        if (!scope.proxy) return;
                        var setter = $parse(scope.proxy).assign;
                        setter(scope.$parent, element.cropper.bind(element));
                    }

                    scope.$on(scope.hideEvent, function () {
                        if (!shown) return;
                        shown = false;
                        element.cropper('destroy');
                    });

                    scope.$watch('options.disabled', function (disabled) {
                        if (!shown) return;
                        if (disabled) element.cropper('disable');
                        if (!disabled) element.cropper('enable');
                    });
                }
            };
        }])

})();