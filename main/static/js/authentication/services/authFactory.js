(function () {
    'use strict';

    angular.module('cravus.authentication').factory('authFactory', authFactory);
    authFactory.$inject = ['$rootScope', '$location', '$localStorage', '$http', '$window', 'cartFactory'];
    function authFactory($rootScope, $location, $localStorage, $http, $window, cartFactory) {
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
                login(vm, '/+' + vm.username + '/settings');
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
                getAddress();
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
            return $http.get('api/v1/disqus/');
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

        function getAddress() {
            if (!$localStorage.authenticatedAccount) {
                $rootScope.location = 'Downtown Austin';
                return;
            }
            $http.get('api/v1/address/' + $rootScope.authenticatedAccount.username + '/').then(addressSuccessFn, addressErrorFn);

            function addressSuccessFn(data, status, headers, config) {
                var result = data.data;
                $rootScope.location = '';
                if (result.zip) $rootScope.location = result.zip;
                if (result.state) $rootScope.location = result.state + ' ' + $rootScope.location;
                if (result.city)  $rootScope.location = result.city + ', ' + $rootScope.location;
                if (result.address1) $rootScope.location = result.address1 + ', ' + $rootScope.location;
                $rootScope.location = $rootScope.location.replace(/(^\s*,)|(,\s*$)/g, '');
                if ($rootScope.location === '') $rootScope.location = 'Downtown Austin';
            }

            function addressErrorFn(data, status, headers, config) {
                $rootScope.location = 'Downtown Austin';
            }
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
            delete $rootScope.disqusPayload;
            delete $rootScope.disqusPublic;
            $rootScope.location = 'Downtown Austin';
            cartFactory.empty();
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
            unauthenticate: unauthenticate,
            getAddress: getAddress
        };
    }

})();