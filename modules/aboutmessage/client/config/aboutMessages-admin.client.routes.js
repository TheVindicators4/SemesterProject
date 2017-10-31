(function () {
  'use strict';

  angular
    .module('aboutMessages.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.aboutMessages', {
        abstract: true,
        url: '/aboutMessages',
        template: '<ui-view/>'
      })
      .state('admin.aboutMessages.list', {
        url: '',
        templateUrl: '/modules/aboutMessages/client/views/admin/list-aboutMessages.client.view.html',
        controller: 'AboutMessagesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.aboutMessages.create', {
        url: '/create',
        templateUrl: '/modules/aboutMessages/client/views/admin/form-aboutMessage.client.view.html',
        controller: 'AboutMessagesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          aboutMessageResolve: newAboutMessage
        }
      })
      .state('admin.aboutMessages.edit', {
        url: '/:aboutMessageId/edit',
        templateUrl: '/modules/aboutMessages/client/views/admin/form-aboutMessage.client.view.html',
        controller: 'AboutMessagesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ aboutMessageResolve.title }}'
        },
        resolve: {
          aboutMessageResolve: getAboutMessage
        }
      });
  }

  getAboutMessage.$inject = ['$stateParams', 'AboutMessagesService'];

  function getAboutMessage($stateParams, AboutMessagesService) {
    return AboutMessagesService.get({
      aboutMessageId: $stateParams.aboutMessageId
    }).$promise;
  }

  newAboutMessage.$inject = ['AboutMessagesService'];

  function newAboutMessage(AboutMessagesService) {
    return new AboutMessagesService();
  }
}());
