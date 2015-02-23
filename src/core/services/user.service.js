/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('userService', userService);

    userService.$inject = ['$http', '$location', 'exception', 'api2'];
    /* @ngInject */
    function userService($http, $location, exception, api2) {
        var service = {
            getUser: getUser
        };

        return service;

        function getUser() {
            return $http.get(api2 + '/users')
                .then(getUserComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getAccount')(message);
                    $location.url('/');
                });

            function getUserComplete(data) {
                return data.data;
            }
        }
    }
})();
