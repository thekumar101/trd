(function() {
    'use strict';

    angular.module('app', [
        // Common (everybody has access to these)
        'app.core',

        // Features
        'app.login',
        'app.dashboard',
        'app.profile'
    ]);
})();
