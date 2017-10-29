(function () {
  'use strict';

  angular
    .module('eventstream.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventstream', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('eventstream.list', {
        url: '',
        templateUrl: '/modules/eventstream/client/views/list-eventstream.client.view.html',
        controller: 'EventstreamListController',
        controllerAs: 'vm'
      })
      .state('eventstream.view', {
        url: '/:eventstreamId',
        templateUrl: '/modules/eventstream/client/views/view-eventstream.client.view.html',
        controller: 'EventstreamController',
        controllerAs: 'vm',
        resolve: {
          eventstreamResolve: getEventstream
        },
        data: {
          pageTitle: '{{ eventstreamResolve.title }}'
        }
      });
  }

  getEventstream.$inject = ['$stateParams', 'EventstreamService'];

  function getEventstream($stateParams, EventstreamService) {
    return EventstreamService.get({
      eventstreamId: $stateParams.eventstreamId
    }).$promise;
  }
}());
