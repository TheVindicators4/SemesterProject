(function () {
  'use strict';

  angular
    .module('aboutMessages.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('aboutMessages', {
        abstract: true,
        url: '/aboutMessages',
        template: '<ui-view/>'
      })
      .state('aboutMessages.list', {
        url: '',
        templateUrl: '/modules/aboutMessages/client/views/list-aboutMessages.client.view.html',
        controller: 'AboutMessagesListController',
        controllerAs: 'vm'
      })
      .state('aboutMessages.view', {
        url: '/:aboutMessageId',
        templateUrl: '/modules/aboutMessages/client/views/view-aboutMessage.client.view.html',
        controller: 'AboutMessagesController',
        controllerAs: 'vm',
        resolve: {
          aboutMessageResolve: getAboutMessage
        },
        data: {
          pageTitle: '{{ aboutMessageResolve.title }}'
        }
      });
  }

  getAboutMessage.$inject = ['$stateParams', 'AboutMessagesService'];

  function getAboutMessage($stateParams, AboutMessagesService) {
    return AboutMessagesService.get({
      aboutMessageId: $stateParams.aboutMessageId
    }).$promise;
  }
}());
