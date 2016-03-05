(function () {
    'use strict';

    angular.module('cravus.dishes').controller('manageDishesController', manageDishesController);
    manageDishesController.$inject = ['$rootScope', '$location', '$routeParams', 'authFactory', 'dishesFactory', '$filter', '$mdDialog', 'ytplayerFactory'];
    function manageDishesController($rootScope, $location, $routeParams, authFactory, dishesFactory, $filter, $mdDialog, ytplayerFactory) {
        var username = $routeParams.username.substr(1);
        var vm = this;
        vm.loading = false;
        vm.dishes = [];
        vm.scheduled = [];
        vm.repeated = [];
        vm.newdish = {};
        vm.dish = {};
        vm.dish.repeat_daily = false;
        vm.dish.date = new Date();
        vm.dish.minDate = new Date();
        vm.dish.maxDate = new Date(vm.dish.minDate.getFullYear(), vm.dish.minDate.getMonth(), vm.dish.minDate.getDate() + 7);
        vm.cuisines = dishesFactory.cuisines;
        vm.getDishes = getDishes;
        vm.add = add;
        vm.schedule = schedule;
        vm.unschedule = unschedule;
        vm.repeatFn = repeatFn;
        vm.setDishImage = setDishImage;
        vm.getScheduledDishes = getScheduledDishes;
        vm.edit = edit;

        activate();
        function activate() {
            $rootScope.title = "Manage Dishes";
            $rootScope.loading = true;
            ytplayerFactory.stop();
            authFactory.isAuthenticated();
            authFactory.getAuthenticatedAccount();
            if ($rootScope.authenticatedAccount) {
                if ($rootScope.authenticatedAccount.username !== username) {
                    $rootScope.loading = false;
                    toast('error', '#globalToast', 'You are not authorized to view this page.', 'none');
                    $location.url('/dishes');
                }
            }
            getDishes();
        }

        function getDishes() {
            dishesFactory.get(username).then(dishesSuccessFn, dishesErrorFn);

            function dishesSuccessFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.dishes = data.data;
                    getScheduledDishes();
                } else {
                    vm.dishes = [];
                }
            }

            function dishesErrorFn(data, status, headers, config) {
                vm.loading = false;
                $rootScope.loading = false;
                toast('error', '#globalToast', 'Problem connecting to server, refresh the page or try again later', 'none');
            }
        }

        function getScheduledDishes() {
            dishesFactory.getScheduledDishes(vm.dish.date, username).then(getScheduledDishesSuccessFn, getScheduledDishesErrorFn);

            function getScheduledDishesSuccessFn(data, status, headers, config) {
                moveElement(vm.scheduled, vm.dishes);
                moveElement(vm.repeated, vm.dishes);
                if (data.data.length > 0) {
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].repeat_daily == vm.dish.repeat_daily) {
                            moveElement(vm.dishes, vm.scheduled, data.data[i]);
                        } else if (!vm.dish.repeat_daily && data.data[i].repeat_daily) {
                            moveElement(vm.dishes, vm.repeated, data.data[i]);
                        }
                    }
                } else {
                    vm.scheduled = [];
                }
                vm.loading = false;
                $rootScope.loading = false;
            }

            function getScheduledDishesErrorFn(data, status, headers, config) {
                vm.loading = false;
                $rootScope.loading = false;
                toast('error', '#globalToast', 'Problem connecting to server, refresh the page or try again later', 'none');
            }

            function moveElement(source, target, data) {
                for (var i = 0; i < source.length; i++) {
                    var element = source[i];
                    if (data) {
                        if (element.id == data.dish) {
                            source.splice(i, 1);
                            element.scheduleId = data.id;
                            target.push(element);
                            break;
                        }
                    } else {
                        source.splice(i, 1);
                        target.push(element);
                        i--;
                    }
                }
            }
        }

        function add() {
            vm.loading = true;
            dishesFactory.create(vm.newdish).then(createDishSuccessFn, createDishErrorFn);

            function createDishSuccessFn(data, status, headers, config) {
                getDishes();
                vm.newdish = {};
                recreatePreview();
                toast('success', '#toastBounds', "Dish created.  Don't forget to schedule your new dish.", 'none');
            }

            function createDishErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('dish.created.error');
                vm.loading = false;
                toast('error', '#toastBounds', data.data, 'none');
            }

            function recreatePreview() {
                var $preview = $('#cropperPreview');
                var $img = $("#cropperPreviewImg");
                $preview.attr({'style': ''});
                $img.attr({'style': ''});
            }
        }

        function schedule(id) {
            vm.dish.id = id;
            dishesFactory.schedule(vm.dish).then(scheduleDishSuccessFn, scheduleDishErrorFn);

            function scheduleDishSuccessFn(data, status, headers, config) {
                getScheduledDishes();
                toast('success', '#toastBounds', 'Dish scheduled for ' + $filter('date')(vm.dish.date, "yyyy-MM-dd") + '.', 'none');
            }

            function scheduleDishErrorFn(data, status, headers, config) {
                toast('error', '#toastBounds', data.data, 'none');
            }
        }

        function unschedule(id) {
            dishesFactory.unschedule(id).then(unscheduleDishSuccessFn, unscheduleDishErrorFn);

            function unscheduleDishSuccessFn(data, status, headers, config) {
                getScheduledDishes();
                toast('success', '#toastBounds', 'Dish unscheduled.', 'none');
            }

            function unscheduleDishErrorFn(data, status, headers, config) {
                toast('error', '#toastBounds', data.data, 'none');
            }
        }

        function edit(id) {
            $mdDialog.show({
                controller: 'editDishController',
                controllerAs: 'vm',
                bindToController: true,
                templateUrl: '/static/partials/dishes/edit-dish.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                disableParentScroll: false,
                locals: {id: id}
            }).then(function (response) {
                if (response.action === "delete") {
                    del(response.id);
                } else if (response.action === "update") {
                    updateDishes(vm.scheduled, vm.dishes, response.data);
                }

                function del(id) {
                    $mdDialog.show(
                        $mdDialog.confirm()
                            .clickOutsideToClose(true)
                            .title('Are you sure you want to delete this Dish?')
                            .ariaLabel('Delete confirmation')
                            .ok('Delete')
                            .cancel('Cancel')
                    ).then(function () {
                        dishesFactory.delDish(id).then(delDishSuccessFn, delDishErrorFn);
                    });

                    function delDishSuccessFn(data, status, headers, config) {
                        deleteDish(vm.scheduled, vm.dishes, id);
                        toast('success', '#toastBounds', 'Dish deleted.', 'none');
                    }

                    function delDishErrorFn(data, status, headers, config) {
                        toast('error', '#toastBounds', "Error deleting dish, try again later.", 'none');
                    }
                }
            });

            function updateDishes(source1, source2, data) {
                var found = false;
                var element = {};
                for (var i = 0; i < source1.length && !found; i++) {
                    element = source1[i];
                    if (element.id == data.id) {
                        source1[i] = data;
                        found = true;
                        break;
                    }
                }
                for (var j = 0; j < source2.length && !found; j++) {
                    element = source2[j];
                    if (element.id == data.id) {
                        source2[j] = data;
                        found = true;
                        break;
                    }
                }
            }

            function deleteDish(source1, source2, id) {
                var found = false;
                var element = {};
                for (var i = 0; i < source1.length && !found; i++) {
                    element = source1[i];
                    if (element.id == id) {
                        source1.splice(i, 1);
                        found = true;
                        break;
                    }
                }
                for (var j = 0; j < source2.length && !found; j++) {
                    element = source2[j];
                    if (element.id == id) {
                        source2.splice(j, 1);
                        found = true;
                        break;
                    }
                }
            }
        }

        function setDishImage(image) {
            if (image) {
                return {'background-image': 'url(' + image + ')'}
            } else {
                return {'background-image': 'url(/static/img/dish_default.jpg)'}
            }
        }

        function repeatFn(element) {
            var target = element.querySelector('div.grid > div.grid-item > figure');
            target.addEventListener('touchstart', function (e) {
                $("figure").removeClass("cs-hover");
                classie.toggle(this, 'cs-hover');
            }, false);
        }
    }

})();