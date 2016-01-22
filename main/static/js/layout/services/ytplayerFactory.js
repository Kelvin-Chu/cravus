(function ($, _) {
    'use strict';

    angular.module('cravus.layout').factory('ytplayerFactory', ytplayerFactory);
    ytplayerFactory.$inject = ['$rootScope'];
    function ytplayerFactory($rootScope) {

        function play() {
            $rootScope.bgimg = 'static/img/bg2.jpg';
            $rootScope.hideHeader = false;
            try {
                $(".player").YTPlayer();
                $('#bgndVideo').YTPPlay();
                $('.mbYTP_wrapper').css({'z-index': '0'});
            } catch (e) {
            }
        }

        function stop() {
            $rootScope.bgimg = 'none';
            $rootScope.hideHeader = true;
            try {

                $('.mbYTP_wrapper').css({'z-index': '-100'});
            } catch (e) {
            }
        }

        return {
            play: play,
            stop: stop
        };
    }

})($, _);