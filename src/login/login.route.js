(function() {
    'use strict';
    console.log('login route');
    angular
        .module('app.login')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    /* @ngInject */
    function appRun(routerHelper) {     
        console.log('appRun');
        routerHelper.configureStates(getStates(), '/');
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/',
                    templateUrl: 'login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Login',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-login"></i> Login'
                    }
                }
            }
        ];
    }
})();
