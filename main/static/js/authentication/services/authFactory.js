(function () {
    'use strict';

    angular.module('cravus.authentication').factory('authFactory', authFactory);
    authFactory.$inject = ['$localStorage', '$http', '$mdToast'];
    function authFactory($localStorage, $http, $mdToast) {
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
                if (data.data.email) {
                    $mdToast.show($mdToast.simple().textContent('Email: ' + data.data.email[0]).hideDelay(3000));
                }
                if (data.data.username) {
                    $mdToast.show($mdToast.simple().textContent('Username: ' + data.data.username[0]).hideDelay(3000));
                }
                if (data.data.password) {
                    $mdToast.show($mdToast.simple().textContent('Password: ' + data.data.password[0]).hideDelay(3000));
                }
            }
        }

        function chefRegister(email, password, username) {
            return $http.post('/api/v1/chef/accounts/', {
                username: username,
                password: password,
                email: email
            }).then(registerSuccessFn, registerErrorFn);

            function registerSuccessFn(data, status, headers, config) {
                login(email, password);
            }

            function registerErrorFn(data, status, headers, config) {
                if (data.data.email) {
                    $mdToast.show($mdToast.simple().textContent('Email: ' + data.data.email[0]).hideDelay(3000));
                }
                if (data.data.username) {
                    $mdToast.show($mdToast.simple().textContent('Username: ' + data.data.username[0]).hideDelay(3000));
                }
                if (data.data.password) {
                    $mdToast.show($mdToast.simple().textContent('Password: ' + data.data.password[0]).hideDelay(3000));
                }
            }
        }

        function login(email, password, next) {
            return $http.post('/api/v1/auth/login/', {
                email: email,
                password: password
            }).then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(data, status, headers, config) {
                setAuthenticatedAccount(data.data);
                window.location = '/';
            }

            function loginErrorFn(data, status, headers, config) {
                $mdToast.show($mdToast.simple().textContent('Incorrect email/password combination.').hideDelay(3000));
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