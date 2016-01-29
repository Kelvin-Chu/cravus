(function () {
    'use strict';

    angular.module('cravus.authentication').factory('authFactory', authFactory);
    authFactory.$inject = ['$rootScope', '$location', '$localStorage', '$http', '$mdToast'];
    function authFactory($rootScope, $location, $localStorage, $http, $mdToast) {
        function register(vm) {
            return $http.post('/api/v1/accounts/', {email: vm.email, password: vm.password, username: vm.username})
                .then(registerSuccessFn, registerErrorFn);

            function registerSuccessFn(data, status, headers, config) {
                clearErrors(vm);
                login(vm);
            }

            function registerErrorFn(data, status, headers, config) {
                setErrors(vm, data);
            }
        }

        function chefRegister(vm) {
            return $http.post('/api/v1/chefs/', {email: vm.email, password: vm.password, username: vm.username})
                .then(chefRegisterSuccessFn, chefRegisterErrorFn);

            function chefRegisterSuccessFn(data, status, headers, config) {
                clearErrors(vm);
                login(vm);
            }

            function chefRegisterErrorFn(data, status, headers, config) {
                setErrors(vm, data);
            }
        }

        function login(vm) {
            return $http.post('/api/v1/auth/login/', {email: vm.email, password: vm.password})
                .then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
                clearErrors(vm);
                $location.url('/dishes');
            }

            function loginErrorFn(data, status, headers, config) {
                setErrors(vm, data);
            }
        }

        function refresh() {
            return $http.post('/api/v1/auth/refresh/', {
                token: $localStorage.token
            }).then(logoutSuccessFn, logoutErrorFn);

            function logoutSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
            }

            function logoutErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('Please log in.').hideDelay(3000));
                unauthenticate();
                $location.url('/login');
            }
        }

        function verify() {
            return $http.post('/api/v1/auth/verify/', {
                token: $localStorage.token
            }).then(verifySuccessFn, verifyErrorFn);

            function verifySuccessFn(data, status, headers, config) {
            }

            function verifyErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('Please log in.').hideDelay(3000));
                unauthenticate();
                $location.url('/login');
            }
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