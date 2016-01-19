(function ($, _) {
    'use strict';

    angular.module('cravus.layout').factory('ytplayerFactory', ytplayerFactory);
    function ytplayerFactory() {

        function play() {
            try {
                $(".player").YTPlayer();
                $('#bgndVideo').YTPPlay();
                $('.mbYTP_wrapper').css({'z-index' : '0'});
            } catch (e) {
            }
        }

        function stop() {
            try {
                $('#bgndVideo').YTPStop();
                $('.mbYTP_wrapper').css({'z-index' : '-100'});
            } catch (e) {
            }
        }

        return {
            play: play,
            stop: stop
        };
    }

})($, _);