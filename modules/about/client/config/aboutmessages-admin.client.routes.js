(function () {
  'use strict';

  angular
    .module('aboutmessages.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.aboutmessages', {
        abstract: true,
        url: '/aboutmessages',
        template: '<ui-view/>'
      })
      .state('admin.aboutmessages.list', {
        url: '',
        templateUrl: '/modules/about/client/views/admin/list-aboutmessages.client.view.html',
        controller: 'AboutmessagesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.aboutmessages.create', {
        url: '/create',
        templateUrl: '/modules/about/client/views/admin/form-aboutmessage.client.view.html',
        controller: 'AboutmessagesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          aboutmessageResolve: newAboutmessage
        }
      })
      .state('admin.aboutmessages.edit', {
        url: '/:aboutmessageId/edit',
        templateUrl: '/modules/about/client/views/admin/form-aboutmessage.client.view.html',
        controller: 'AboutmessagesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ aboutmessageResolve.title }}'
        },
        resolve: {
          aboutmessageResolve: getAboutmessage
        }
      });
  }

  getAboutmessage.$inject = ['$stateParams', 'AboutmessagesService'];

  function getAboutmessage($stateParams, AboutmessagesService) {
    return AboutmessagesService.get({
      aboutmessageId: $stateParams.aboutmessageId
    }).$promise;
  }

  newAboutmessage.$inject = ['AboutmessagesService'];

  function newAboutmessage(AboutmessagesService) {
    return new AboutmessagesService();
  }
}());
