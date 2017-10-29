(function () {
  'use strict';

  // Setting up route
  angular
    .module('events')
    .config(routeConfig);

routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('events', {
        url: '/events',
        templateUrl: '/modules/homePage/client/views/list-listings.client.view.html'
      })
  }
}());
