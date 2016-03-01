(function () {
    'use strict';

    angular.module('cravus.layout').controller('listDishesController', listDishesController);
    listDishesController.$inject = ['$scope', 'dishesFactory', 'ytplayerFactory', '$mdDialog'];
    function listDishesController($scope, dishesFactory, ytplayerFactory, $mdDialog) {
        var vm = this;
        vm.dishes = [];
        vm.dish = dish;

        activate();
        function activate() {
            ytplayerFactory.stop();
            dishesFactory.all().then(dishesSuccessFn, dishesErrorFn);

            $scope.$on('dish.created', function (event, dish) {
                vm.dishes.unshift(dish);
            });

            $scope.$on('dish.created.error', function () {
                vm.dishes.shift();
            });

            function dishesSuccessFn(data, status, headers, config) {
                vm.dishes = data.data;
            }

            function dishesErrorFn(data, status, headers, config) {
                toast('error', '#globalToast', 'Site in maintenance, try again later!', 'none');
            }
        }

        function dish(id) {
            dishesFactory.getDish(id).then(getDishSuccessFn, getDishErrorFn);

            function getDishSuccessFn(data, status, headers, config) {
                if (!data.data.image) {
                    data.data.image = '/static/img/dish_default.jpg';
                }
                var img = document.createElement("img");
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
                    img.remove();
                    $mdDialog.show({
                        controller: 'dishController',
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
                toast('error', '#globalToast', 'Problem connecting to server, refresh the page or try again later', 'none');
            }


        }
    }
})();