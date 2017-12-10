(function () {
  'use strict';

  angular
    .module('email.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  // configures the routes for mailing list
  function routeConfig($stateProvider) {
    $stateProvider
      .state('email', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('email.list', {
        url: '',
        templateUrl: '/modules/mailinglist/client/views/list-email.client.view.html',
        controller: 'EmailListController',
        controllerAs: 'vm'
      })
      .state('email.view', {
        url: '/:emailId',
        templateUrl: '/modules/mailinglist/client/views/view-email.client.view.html',
        controller: 'EmailController',
        controllerAs: 'vm',
        resolve: {
          emailResolve: getEmail
        },
        data: {
          pageTitle: '{{ emailResolve.title }}'
        }
      });
  }

  getEmail.$inject = ['$stateParams', 'EmailService'];

  function getEmail($stateParams, EmailService) {
    return EmailService.get({
      emailId: $stateParams.emailId
    }).$promise;
  }
}());
