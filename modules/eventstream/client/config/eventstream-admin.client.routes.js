(function () {
  'use strict';

  angular
    .module('eventstream.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.eventstream', {
        abstract: true,
        url: '/eventstream',
        template: '<ui-view/>'
      })
      .state('admin.eventstream.list', {
        url: '',
        templateUrl: '/modules/eventstream/client/views/admin/list-eventstream.client.view.html',
        controller: 'EventstreamAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.eventstream.create', {
        url: '/create',
        templateUrl: '/modules/eventstream/client/views/admin/form-eventstream.client.view.html',
        controller: 'EventstreamAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          eventstreamResolve: newEventstream
        }
      })
      .state('admin.eventstream.edit', {
        url: '/:eventstreamId/edit',
        templateUrl: '/modules/eventstream/client/views/admin/form-eventstream.client.view.html',
        controller: 'EventstreamAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ eventstreamResolve.title }}'
        },
        resolve: {
          eventstreamResolve: getEventstream
        }
      });
  }

  getEventstream.$inject = ['$stateParams', 'EventstreamService'];

  function getEventstream($stateParams, EventstreamService) {
    return EventstreamService.get({
      eventstreamId: $stateParams.eventstreamId
    }).$promise;
  }

  newEventstream.$inject = ['EventstreamService'];

  function newEventstream(EventstreamService) {
    return new EventstreamService();
  }
}());
