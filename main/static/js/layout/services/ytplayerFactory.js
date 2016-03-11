(function ($, _) {
    'use strict';

    angular.module('cravus.layout').factory('ytplayerFactory', ytplayerFactory);
    ytplayerFactory.$inject = ['$rootScope', '$timeout'];
    function ytplayerFactory($rootScope, $timeout) {

        function stop() {
            $rootScope.bgimg = 'none';
            $rootScope.showBrand = false;
            try {
                var player = $('#bgndVideo');
                $('.mbYTP_wrapper').remove();
            } catch (e) {
            }
        }

        function play() {
            $rootScope.bgimg = 'static/img/bg2.jpg';
            $rootScope.showBrand = true;
            try {
                var player = $('#bgndVideo');
                player.YTPlayer();
                player.YTPPlay();
                $('.mbYTP_wrapper').css({'z-index': '0'});
            } catch (e) {
            }
        }

        return {
            play: play,
            stop: stop
        };
    }

})($, _);