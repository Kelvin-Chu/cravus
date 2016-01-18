(function () {
    'use strict';

    angular.module('cravus.authentication').factory('authFactory', authFactory);
    authFactory.$inject = ['$localStorage', '$http', 'snackbarFactory'];
    function authFactory($localStorage, $http, snackbarFactory) {
        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            }).then(registerSuccessFn, registerErrorFn);

            function registerSuccessFn(data, status, headers, config) {
                login(email, password);
            }

            function registerErrorFn(data, status, headers, config) {
                console.log(data);
                if(data.data.email) {
                    snackbarFactory.show('Email: ' + data.data.email[0]);
                }
                if(data.data.username) {
                    snackbarFactory.show('Username: ' +data.data.username[0]);
                }
                if(data.data.password) {
                    snackbarFactory.show('Password: ' +data.data.password[0]);
                }
            }
        }

        function login(email, password) {
            return $http.post('/api/v1/auth/login/', {
                email: email,
                password: password
            }).then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
                window.location = '/';
            }

            function loginErrorFn(data, status, headers, config) {
                console.log('Incorrect email/password combination.');
                snackbarFactory.error(data.error);
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
                snackbarFactory.error('Please log in.');
                unauthenticate();
                window.location = '/login';
            }
        }

        function verify() {
            return $http.post('/api/v1/auth/verify/', {
                token: $localStorage.token
            }).then(logoutSuccessFn, logoutErrorFn);

            function logoutSuccessFn(data, status, headers, config) {}

            function logoutErrorFn(data, status, headers, config) {
                snackbarFactory.error('Please log in.');
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
            refresh: refresh,
            verify: verify,
            logout: logout,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate
        };
    }

})();