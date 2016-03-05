(function () {
    'use strict';

    angular.module('cravus.profiles').controller('profileController', profileController);
    profileController.$inject = ['$rootScope', '$location', '$routeParams', 'dishesFactory', 'profileFactory',
        'addressFactory', 'chefFactory', 'ytplayerFactory', '$timeout', '$mdDialog', '$window'];
    function profileController($rootScope, $location, $routeParams, dishesFactory, profileFactory, addressFactory,
                               chefFactory, ytplayerFactory, $timeout, $mdDialog, $window) {
        var vm = this;
        vm.username = $routeParams.username.substr(1);
        vm.profile = null;
        vm.dishes = [];
        vm.address = {};
        vm.disqus_ready = false;
        vm.disqus_id = "";
        vm.disqus_url = $location.absUrl();
        vm.disqus_title = "Chef " + vm.username;
        vm.name = "";
        vm.loading = true;
        vm.myProfile = false;
        vm.date = {};
        vm.date.today = new Date();
        vm.date.tomorrow = new Date(vm.date.today.getFullYear(), vm.date.today.getMonth(), vm.date.today.getDate() + 1);
        vm.dish = dish;
        vm.tabChange = tabChange;
        vm.set_ready = set_ready();

        activate();
        function activate() {
            $rootScope.title = vm.username + "'s Profile";
            $rootScope.loading = true;
            ytplayerFactory.stop();
            profileFactory.get(vm.username).then(profileSuccessFn, profileErrorFn);
            addressFactory.get(vm.username).then(addressSuccessFn, addressErrorFn);
            chefFactory.get(vm.username).then(chefSuccessFn, chefErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                if (!data.data.is_chef) {
                    $rootScope.loading = false;
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
                vm.loading = false;
                $rootScope.loading = false;
            }

            function profileErrorFn(data, status, headers, config) {
                $rootScope.loading = false;
                $location.url('/dishes');
                toast('error', '#globalToast', 'User does not exist.', 'none');
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
            vm.disqus_ready = true;
        }

        function tabChange(tab) {
            vm.dishes = [];
            $rootScope.loading = true;
            if (tab === 'today') {
                dishesFactory.getScheduledDishes(vm.date.today, vm.username).then(getDishesSuccessFn, getDishesErrorFn);
            } else if (tab === 'tomorrow') {
                dishesFactory.getScheduledDishes(vm.date.tomorrow, vm.username).then(getDishesSuccessFn, getDishesErrorFn);
            } else if (tab === 'all') {
                dishesFactory.get(vm.username).then(getDishesSuccessFn, getDishesSuccessFn);
            } else {
                $rootScope.loading = false;
            }

            function getDishesSuccessFn(data, status, headers, config) {
                vm.dishes = data.data;
                $rootScope.loading = false;
            }

            function getDishesErrorFn(data, status, headers, config) {
                $rootScope.loading = false;
            }
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
                        this.page.title = vm.disqus_title;
                    }
                });
                vm.disqus_ready = true;
            }

        }
    }

})();