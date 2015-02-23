(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['accountService', 'logger', '$scope', 'OrderService', 'OrderEventService', 'EventType'];

    /* @ngInject */
    function DashboardController(accountService, logger, $scope, OrderService, OrderEventService, EventType) {
        var vm = this;

        vm.account = null;

        activate();

        function activate() {
            return getAccount().then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function getAccount() {
            return accountService.getAccount().then(function(data) {
                vm.account = data;
                return vm.account;
            });
        }

        /*----- Order events start -----*/
        $scope.users = OrderService.users();
        $scope.instruments = OrderService.instruments();
        $scope.orders = OrderService.orders();

        // Returns a random integer between min and max
        // Using Math.round() will give you a non-uniform distribution!
        // Based on: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
        function getRandomInt (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function findOrder(id) {
            return _.find($scope.orders, {id: id});
        }

        $scope.createOrder = function() {
            var numInstruments = $scope.instruments.length;
            OrderService.createOrder(null, {
                side: 'Buy',
                symbol: $scope.instruments[getRandomInt(0, numInstruments-1)].symbol,
                quantity: 5000,
                limitPrice: 100,
                traderId: 'SS'                
            });
        };

        $scope.refreshOrders = function() {
            $scope.orders = OrderService.orders();
        };

        $scope.clearOrders = function() {
            OrderService.clearOrders();
        };

        OrderEventService.on(EventType.orderCreated, function(order) {
            $scope.orders.push(order);
        });

        OrderEventService.on(EventType.placementCreated, function(placement) {
            var order = findOrder(placement.orderId);

            if (order) {
                order.quantityPlaced += placement.quantityPlaced;
                order.status = placement.status;
            }
        });

        OrderEventService.on(EventType.executionCreated, function(execution) {
            var order = findOrder(execution.orderId);

            if (order) {
                order.quantityExecuted += execution.quantityExecuted;
                order.status = execution.status;
                order.executionPrice = execution.executionPrice;
            }
        });

        OrderEventService.on(EventType.allOrdersDeleted, function() {
            $scope.orders = [];
        });
        /*----- Order events end -----*/
    }

    /*----- Order services to be moved to service forlder -----*/
    angular.module('app.dashboard')
        .factory('OrderService', OrderService);

    OrderService.$inject = ['$resource', 'ServerUrl'];

    function OrderService($resource, ServerUrl) {

        return $resource(ServerUrl + '/:type', null, {
            users: {
                method: 'GET',
                params: { type: 'users' },
                isArray: true
            },
            instruments: {
                method: 'GET',
                params: { type: 'instruments' },
                isArray: true
            },

            orders: {
                method: 'GET',
                params: { type: 'orders'},
                isArray: true
            },

            createOrder: {
                method: 'POST',
                params: { type: 'orders'}
            },

            clearOrders: {
                method: 'DELETE',
                params: { type: 'orders' }
            }
        });
    };

        
    angular.module('app.dashboard')
        .service('OrderEventService', OrderEventService); 

    OrderEventService.$inject = ['ServerUrl', 'socketFactory'];

    function OrderEventService(ServerUrl, socketFactory) {

        var socket = socketFactory({
            ioSocket: io.connect(ServerUrl)
        });

        this.on = function(eventType, callback) {
            socket.on(eventType, callback);
        };
    };


})();
