(function () {
    'use strict';

    angular.module('cravus.authentication').factory('authFactory', authFactory);
    authFactory.$inject = ['$rootScope', '$location', '$localStorage', '$http', '$window'];
    function authFactory($rootScope, $location, $localStorage, $http, $window) {
        function register(vm) {
            return $http.post('/api/v1/accounts/', {email: vm.email, password: vm.password, username: vm.username})
                .then(registerSuccessFn, registerErrorFn);

            function registerSuccessFn(data, status, headers, config) {
                clearErrors(vm);
                login(vm);
            }

            function registerErrorFn(data, status, headers, config) {
                clearErrors(vm);
                setErrors(vm, data);
            }
        }

        function chefRegister(vm) {
            return $http.post('/api/v1/chefs/', {email: vm.email, password: vm.password, username: vm.username})
                .then(chefRegisterSuccessFn, chefRegisterErrorFn);

            function chefRegisterSuccessFn(data, status, headers, config) {
                clearErrors(vm);
                login(vm, '/+' + vm.username);
            }

            function chefRegisterErrorFn(data, status, headers, config) {
                clearErrors(vm);
                setErrors(vm, data);
            }
        }

        function login(vm, page, close) {
            return $http.post('/api/v1/auth/login/', {email: vm.email, password: vm.password})
                .then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
                clearErrors(vm);
                setDisqusSSO();

                if (page) {
                    $location.url(page);
                } else if (close) {
                    $window.close();
                } else {
                    $location.url('/dishes');
                }
            }

            function loginErrorFn(data, status, headers, config) {
                clearErrors(vm);
                setErrors(vm, data);
            }
        }

        function setDisqusSSO() {
            if ($rootScope.authenticatedAccount) {
                if ($localStorage.disqusPayload) {
                    $rootScope.disqusPayload = $localStorage.disqusPayload;
                    $rootScope.disqusPublic = $localStorage.disqusPublic;
                } else {
                    $http.get('api/v1/accounts/' + $rootScope.authenticatedAccount.username + '/disqus/')
                        .then(setDisqusSSOSuccessFn, setDisqusSSOErrorFn);
                }
            }

            function setDisqusSSOSuccessFn(data, status, headers, config) {
                $localStorage.disqusPayload = data.data.payload;
                $localStorage.disqusPublic = data.data.public_key;
                $rootScope.disqusPayload = data.data.payload;
                $rootScope.disqusPublic = data.data.public_key;
            }

            function setDisqusSSOErrorFn(data, status, headers, config) {
            }
        }

        function reset(email) {
            return $http.post('/api/v1/auth/reset/', {email: email});
        }

        function setPassword(vm) {
            return $http.post('/api/v1/auth/confirm/', {uid: vm.uid, token: vm.token, new_password: vm.new_password});
        }

        function refresh() {
            return $http.post('/api/v1/auth/refresh/', {
                token: $localStorage.token
            }).then(refreshSuccessFn, refreshErrorFn);

            function refreshSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
            }

            function refreshErrorFn(data, status, headers, config) {
            }
        }

        function verify() {
            return $http.post('/api/v1/auth/verify/', {
                token: $localStorage.token
            });
        }

        function logout() {
            unauthenticate();
            window.location = '/';
        }

        function getAuthenticatedAccount() {
            if (!$localStorage.authenticatedAccount) {
                return;
            }
            $rootScope.authenticatedAccount = JSON.parse($localStorage.authenticatedAccount);
            $rootScope.isChef = $rootScope.authenticatedAccount.is_chef;
            return $rootScope.authenticatedAccount;
        }

        function isAuthenticated() {
            $rootScope.isAuthenticated = !!$localStorage.authenticatedAccount;
            return !!$localStorage.authenticatedAccount;
        }

        function setAuthenticatedAccount(account) {
            $localStorage.token = account.token;
            $localStorage.authenticatedAccount = JSON.stringify(account.user);
            $rootScope.isAuthenticated = true;
            getAuthenticatedAccount();
        }

        function unauthenticate() {
            delete $localStorage.token;
            delete $localStorage.authenticatedAccount;
            delete $rootScope.isAuthenticated;
            delete $rootScope.authenticatedAccount;
            delete $rootScope.isChef;
            delete $localStorage.disqusPayload;
            delete $localStorage.disqusPublic;
            delete $rootScope.disqusPayload;
            delete $rootScope.disqusPublic;
        }

        return {
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            reset: reset,
            setDisqusSSO: setDisqusSSO,
            setPassword: setPassword,
            register: register,
            chefRegister: chefRegister,
            refresh: refresh,
            verify: verify,
            logout: logout,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate
        };
    }

})();