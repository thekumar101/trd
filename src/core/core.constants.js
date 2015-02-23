(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('api', 'http://localhost:3000/api')
        .constant('api2', 'http://localhost:8080')
        .constant('ServerUrl', 'http://localhost:8080')
    	.constant('EventType', {
	        orderCreated: 'orderCreatedEvent',
	        placementCreated: 'placementCreatedEvent',
	        executionCreated: 'executionCreatedEvent',
	        allOrdersDeleted: 'allOrdersDeletedEvent'
	    });;
})();
