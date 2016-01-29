(function () {
    'use strict';

    angular.module('cravus.authentication').factory('authFactory', authFactory);
    authFactory.$inject = ['$localStorage', '$http', '$mdToast'];
    function authFactory($localStorage, $http, $mdToast) {
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
            return $http.post('/api/v1/chef/accounts/', {email: vm.email, password: vm.password, username: vm.username})
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
                window.location = '/';
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
                window.location = '/login';
            }
        }

        function verify() {
            return $http.post('/api/v1/auth/verify/', {
                token: $localStorage.token
            }).then(logoutSuccessFn, logoutErrorFn);

            function logoutSuccessFn(data, status, headers, config) {
            }

            function logoutErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('Please log in.').hideDelay(3000));
                unauthenticate();
                window.location = '/';
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

            return JSON.parse($localStorage.authenticatedAccount);
        }

        function isAuthenticated() {
            return !!$localStorage.authenticatedAccount;
        }

        function isChef() {
            var user = getAuthenticatedAccount();
            if (user) {
                return user.is_chef;
            }
            return false;
        }

        function setAuthenticatedAccount(account) {
            $localStorage.token = account.token;
            $localStorage.authenticatedAccount = JSON.stringify(account.user);
        }

        function unauthenticate() {
            delete $localStorage.token;
            delete $localStorage.authenticatedAccount;
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
            isChef: isChef,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate
        };
    }

})();