(function () {
  'use strict';

  angular
    .module('email.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.email', {
        abstract: true,
        url: '/email',
        template: '<ui-view/>'
      })
      .state('admin.email.list', {
        url: '',
        templateUrl: '/modules/mailinglist/client/views/admin/list-email.client.view.html',
        controller: 'EmailAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.email.create', {
        url: '/create',
        templateUrl: '/modules/mailinglist/client/views/admin/form-email.client.view.html',
        controller: 'EmailAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          emailResolve: newEmail
        }
      })
      .state('admin.email.edit', {
        url: '/:emailId/edit',
        templateUrl: '/modules/mailinglist/client/views/admin/form-email.client.view.html',
        controller: 'EmailAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ emailResolve.title }}'
        },
        resolve: {
          emailResolve: getEmail
        }
      });
  }

  getEmail.$inject = ['$stateParams', 'EmailService'];

  function getEmail($stateParams, EmailService) {
    return EmailService.get({
      emailId: $stateParams.emailId
    }).$promise;
  }

  newEmail.$inject = ['EmailService'];

  function newEmail(EmailService) {
    return new EmailService();
  }
}();
