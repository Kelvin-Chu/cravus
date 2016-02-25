(function () {

    angular.module('cravus.layout').directive('onRepeat', onRepeat);
    function onRepeat() {
        return {
            restrict: 'A',
            scope: { onRepeatFn:'&onRepeat' },
            link: function (scope, element, attr) {
                var expressionHandler = scope.onRepeatFn();
                expressionHandler(element[0]);
            }
        }
    }

}());
