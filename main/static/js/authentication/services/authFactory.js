(function () {
    'use strict';

    angular.module('cravus.authentication').factory('authFactory', authFactory);
    authFactory.$inject = ['$rootScope', '$location', '$localStorage', '$http'];
    function authFactory($rootScope, $location, $localStorage, $http) {
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

        function login(vm, page) {
            return $http.post('/api/v1/auth/login/', {email: vm.email, password: vm.password})
                .then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
                clearErrors(vm);
                if (page) {
                    $location.url(page);
                } else {
                    $location.url('/dishes');
                }
            }

            function loginErrorFn(data, status, headers, config) {
                clearErrors(vm);
                setErrors(vm, data);
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
            }).then(logoutSuccessFn, logoutErrorFn);

            function logoutSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
            }

            function logoutErrorFn(data, status, headers, config) {
                toast('error', '#globalToast', 'Please log in.', 'none');
                unauthenticate();
                $location.url('/login');
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
        }

        return {
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            reset: reset,
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