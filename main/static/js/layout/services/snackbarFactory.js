(function ($, _) {
    'use strict';

    angular.module('cravus.layout').factory('snackbarFactory', snackbarFactory);
    function snackbarFactory() {

        function _snackbar(content, options) {
            options = _.extend({timeout: 5000}, options);
            options.content = content;

            $.snackbar(options);
        }

        function error(content, options) {
            _snackbar('Error: ' + content, options);
        }

        function show(content, options) {
            _snackbar(content, options);
        }

        return {
            error: error,
            show: show
        };

    }

})($, _);