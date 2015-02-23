(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['logger', 'userService'];

    /* @ngInject */
    function LoginController(logger, userService) {
        var vm = this;

        vm.user = {};

        activate();

        function activate() {
            return getUser().then(function() {
                logger.info('Activated Login View');
            });
        }

        function getUser() {
            return userService.getUser().then(function(data) {
                vm.user = data;
                return vm.user;
            });
        }

    }
})();