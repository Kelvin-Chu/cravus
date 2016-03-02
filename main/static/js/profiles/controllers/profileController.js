(function () {
    'use strict';

    angular.module('cravus.profiles').controller('profileController', profileController);
    profileController.$inject = ['$rootScope', '$location', '$routeParams', 'dishesFactory', 'profileFactory',
        'addressFactory', 'chefFactory', 'ytplayerFactory', '$timeout', '$mdDialog', '$window'];
    function profileController($rootScope, $location, $routeParams, dishesFactory, profileFactory, addressFactory,
                               chefFactory, ytplayerFactory, $timeout, $mdDialog, $window) {
        var vm = this;
        vm.profile = null;
        vm.dishes = [];
        vm.date = {};
        vm.today = [];
        vm.tomorrow = [];
        vm.address = {};
        vm.disqus_ready = false;
        vm.disqus_id = "";
        vm.disqus_url = $location.absUrl();
        vm.set_ready = set_ready();
        vm.name = "";
        vm.loading = true;
        vm.myProfile = false;
        vm.reviewed = false; //need to be worked on
        vm.date.today = new Date();
        vm.date.tomorrow = new Date(vm.date.today.getFullYear(), vm.date.today.getMonth(), vm.date.today.getDate() + 1);
        vm.dish = dish;

        activate();
        function activate() {
            $rootScope.loading = true;
            ytplayerFactory.stop();
            var username = $routeParams.username.substr(1);
            profileFactory.get(username).then(profileSuccessFn, profileErrorFn);
            dishesFactory.get(username).then(dishesSuccessFn, dishesErrorFn);
            addressFactory.get(username).then(addressSuccessFn, addressErrorFn);
            chefFactory.get(username).then(chefSuccessFn, chefErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                if (!data.data.is_chef) {
                    $location.url('/dishes');
                    toast('error', '#globalToast', 'User is not a chef.', 'none');
                }
                vm.profile = data.data;
                if ($rootScope.isAuthenticated) {
                    if ($rootScope.authenticatedAccount.username == vm.profile.username) {
                        vm.myProfile = true;
                    }
                }
                if (vm.profile.first_name || vm.profile.last_name) {
                    if (vm.profile.first_name) {
                        vm.name = "Chef " + vm.profile.first_name + " " + vm.profile.last_name;
                    } else {
                        vm.name = "Chef " + vm.profile.last_name;
                    }

                } else {
                    if (vm.myProfile) {
                        vm.name = "Your Name";
                    } else {
                        vm.name = "Chef " + vm.profile.username;
                    }
                }
                vm.disqus_id = "chef-" + vm.profile.id;
                angular.element(document).ready(function () {
                    vm.loading = false;
                    $rootScope.loading = false;
                });
            }

            function profileErrorFn(data, status, headers, config) {
                $rootScope.loading = false;
                $location.url('/dishes');
                toast('error', '#globalToast', 'User does not exist.', 'none');
            }

            function dishesSuccessFn(data, status, headers, config) {
                if (data.data.length > 0) {
                    vm.dishes = data.data;
                    dishesFactory.getScheduledDishes(username, vm.date.today).then(getTodayDishesSuccessFn, getTodayDishesErrorFn);
                    dishesFactory.getScheduledDishes(username, vm.date.tomorrow).then(getTomorrowDishesSuccessFn, getTomorrowDishesErrorFn);
                } else {
                    vm.dishes = false;
                }

                function getTodayDishesSuccessFn(data, status, headers, config) {
                    if (data.data.length > 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            copyElement(vm.dishes, vm.today, data.data[i]);
                        }
                    }
                }

                function getTodayDishesErrorFn(data, status, headers, config) {

                }

                function getTomorrowDishesSuccessFn(data, status, headers, config) {
                    if (data.data.length > 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            copyElement(vm.dishes, vm.tomorrow, data.data[i]);
                        }
                    }
                }

                function getTomorrowDishesErrorFn(data, status, headers, config) {

                }

                function copyElement(source, target, data) {
                    for (var i = 0; i < source.length; i++) {
                        var element = source[i];
                        if (data) {
                            if (element.id == data.dish) {
                                target.push(element);
                                break;
                            }
                        }
                    }
                }
            }

            function dishesErrorFn(data, status, headers, config) {

            }

            function addressSuccessFn(data, status, headers, config) {
                vm.address = data.data[0];
            }

            function addressErrorFn(data, status, headers, config) {

            }

            function chefSuccessFn(data, status, headers, config) {
                vm.chef = data.data;
                if (vm.myProfile && !vm.chef.tagline) {
                    vm.tagline = "Your Tagline";
                } else {
                    vm.tagline = vm.chef.tagline;
                }
                if (vm.myProfile && !vm.chef.bio) {
                    vm.bio = "A short description about yourself or your kitchen goes here.";
                } else {
                    vm.bio = vm.chef.bio;
                }
            }

            function chefErrorFn(data, status, headers, config) {

            }
        }

        function set_ready() {
            $timeout(function () {
                vm.disqus_ready = true;
            }, 1000);
        }

        function dish(id) {
            $rootScope.loading = true;
            dishesFactory.getDish(id).then(getDishSuccessFn, getDishErrorFn);

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
                    vm.disqus_ready = false;
                    angular.element(document.getElementById("disqus-container")).html('');
                    img.style.maxHeight = "50vh";
                    img.style.minWidth = "320px";
                    img.style.maxWidth = maxWidth;
                    img.style.visibility = 'hidden';
                    document.body.appendChild(img);
                    var imgWidth = img.clientWidth;
                    $rootScope.loading = false;
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
                        compileDisqus();
                    }, function () {
                        compileDisqus();
                    });
                };

            }

            function getDishErrorFn(data, status, headers, config) {
                $rootScope.loading = false;
                toast('error', '#globalToast', 'Problem connecting to server, refresh the page or try again later', 'none');
            }

            function compileDisqus() {
                var container = angular.element(document.getElementById("disqus-container"));
                var element = angular.element('<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>');
                container.append(element);
                $window.DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.identifier = vm.disqus_id;
                        this.page.url = vm.disqus_url;
                        this.page.title = fm.name;
                    }
                });
                vm.disqus_ready = true;
            }

        }
    }

})();