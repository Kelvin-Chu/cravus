(function () {

    angular.module('cravus.layout').directive('spinner', spinner);
    function spinner() {
        return {
            template: '<div class="sk-folding-cube">' +
            '<div class="sk-cube1 sk-cube"></div>' +
            '<div class="sk-cube2 sk-cube"></div>' +
            '<div class="sk-cube4 sk-cube"></div>' +
            '<div class="sk-cube3 sk-cube"></div>' +
            '</div><div class="text-center">Loading...</div>'
        };
    }

}());
