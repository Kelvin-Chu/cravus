(function () {
    'use strict';

    angular.module('cravus.layout').controller('listDishesController', listDishesController);
    listDishesController.$inject = ['$rootScope', '$scope', 'dishesFactory', 'ytplayerFactory', '$mdDialog', '$routeParams', 'authFactory', 'cartFactory'];
    function listDishesController($rootScope, $scope, dishesFactory, ytplayerFactory, $mdDialog, $routeParams, authFactory, cartFactory) {
        var vm = this;
        vm.loading = true;
        vm.scrolling = false;
        vm.scrollDisabled = true;
        vm.nextPage = '';
        vm.location = '';
        vm.query = null;
        vm.date = {};
        vm.date.today = new Date();
        vm.date.tomorrow = new Date(vm.date.today.getFullYear(), vm.date.today.getMonth(), vm.date.today.getDate() + 1);
        vm.dishes = [];
        vm.tab = 'today';
        vm.dish = dish;
        vm.tabChange = tabChange;
        vm.scrollFn = scrollFn;
        vm.clear = clear;

        activate();
        function activate() {
            $rootScope.title = "Dishes";
            ytplayerFactory.stop();
            vm.query = $routeParams.query;
            $scope.$on('dish.search', function (event, query) {
                vm.query = query;
                tabChange(vm.tab);
            });
            vm.opendish = $routeParams.dish;
            if (vm.opendish) {
                dish(vm.opendish);
            }
            vm.location = 'Downtown Austin';
        }

        function tabChange(tab) {
            vm.dishes = [];
            $rootScope.loading = true;
            vm.loading = true;
            if (tab === 'today') {
                vm.tab = 'today';
                dishesFactory.getScheduledDishes(vm.date.today, '', vm.query).then(getDishesSuccessFn, getDishesErrorFn);
            } else if (tab === 'tomorrow') {
                vm.tab = 'tomorrow';
                dishesFactory.getScheduledDishes(vm.date.tomorrow, '', vm.query).then(getDishesSuccessFn, getDishesErrorFn);
            } else {
                $rootScope.loading = false;
                vm.loading = false;
            }

            function getDishesSuccessFn(data, status, headers, config) {
                vm.nextPage = data.data.next;
                vm.dishes = data.data.results;
                vm.loading = false;
                $rootScope.loading = false;
                vm.scrollDisabled = false;
            }

            function getDishesErrorFn(data, status, headers, config) {
                $rootScope.loading = false;
                vm.loading = false;
                toast('error', '#globalToast', 'Site in maintenance, try again later!', 'none');
            }
        }

        function scrollFn() {
            vm.scrolling = true;
            if (vm.nextPage && vm.tab === 'today') {
                dishesFactory.getScheduledDishes(vm.date.today, '', '', vm.nextPage).then(getNextDishesSuccessFn, getNextDishesErrorFn);
            } else if (vm.nextPage && vm.tab === 'tomorrow') {
                dishesFactory.getScheduledDishes(vm.date.tomorrow, '', '', vm.nextPage).then(getNextDishesSuccessFn, getNextDishesErrorFn);
            } else {
                vm.scrollDisabled = true;
                vm.scrolling = false;
            }

            function getNextDishesSuccessFn(data, status, headers, config) {
                vm.nextPage = data.data.next;
                if (!vm.nextPage) {
                    vm.scrollDisabled = true;
                }
                vm.dishes = vm.dishes.concat(data.data.results);
                vm.scrolling = false;
            }

            function getNextDishesErrorFn(data, status, headers, config) {
                vm.scrolling = false;
            }
        }

        function dish(id, dish) {
            $rootScope.loading = true;
            authFactory.setDisqusSSO().then(setDisqusSSOSuccessFn, setDisqusSSOErrorFn);


            function setDisqusSSOSuccessFn(data, status, headers, config) {
                $rootScope.disqusPayload = data.data.payload;
                $rootScope.disqusPublic = data.data.public_key;
                dishesFactory.getDish(dish).then(getDishSuccessFn, getDishErrorFn);
            }

            function setDisqusSSOErrorFn(data, status, headers, config) {
                dishesFactory.getDish(dish).then(getDishSuccessFn, getDishErrorFn);
            }

            function getDishSuccessFn(data, status, headers, config) {
                if (!data.data.image) {
                    data.data.image = '/static/img/dish_default.jpg';
                }
                var img = document.getElementById('temp-img');
                if (!img) {
                    img = document.createElement("img");
                    img.id = 'temp-img';
                }
                var width = $(window).width();
                var maxWidth = "100%";
                if (width > 991) {
                    maxWidth = "950px";
                } else if (width > 991) {
                    maxWidth = "750px";
                } else if (width > 767) {
                    maxWidth = "600px";
                } else if (width > 479) {
                    maxWidth = "375px";
                }
                img.src = data.data.image;
                img.onload = function () {
                    img.style.maxHeight = "50vh";
                    img.style.minWidth = "320px";
                    img.style.maxWidth = maxWidth;
                    img.style.visibility = 'hidden';
                    document.body.appendChild(img);
                    var imgWidth = img.clientWidth;
                    img.src = null;
                    $rootScope.loading = false;
                    $mdDialog.show({
                        controller: 'dishDetailsController',
                        controllerAs: 'vm',
                        bindToController: true,
                        templateUrl: '/static/partials/dishes/dish-details.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        disableParentScroll: false,
                        locals: {id: id, dish: data.data, width: imgWidth}
                    }).then(function (response) {

                    });
                };

            }

            function getDishErrorFn(data, status, headers, config) {
                $rootScope.loading = false;
                toast('error', '#globalToast', 'Problem connecting to server, refresh the page or try again later', 'none');
            }
        }

        function clear() {
            vm.query = null;
            $rootScope.$broadcast('dish.search', vm.query);
        }
    }

})();