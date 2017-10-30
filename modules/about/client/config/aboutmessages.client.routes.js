(function () {
  'use strict';

  angular
    .module('aboutmessages.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('aboutmessages', {
        abstract: true,
        url: '/aboutmessages',
        template: '<ui-view/>'
      })
      .state('aboutmessages.list', {
        url: '',
        templateUrl: '/modules/about/client/views/list-aboutmessages.client.view.html',
        controller: 'AboutmessagesListController',
        controllerAs: 'vm'
      })
      .state('aboutmessages.view', {
        url: '/:aboutmessageId',
        templateUrl: '/modules/about/client/views/view-aboutmessage.client.view.html',
        controller: 'AboutmessagesController',
        controllerAs: 'vm',
        resolve: {
          aboutmessageResolve: getAboutmessage
        },
        data: {
          pageTitle: '{{ aboutmessageResolve.title }}'
        }
      });
  }

  getAboutmessage.$inject = ['$stateParams', 'AboutmessagesService'];

  function getAboutmessage($stateParams, AboutmessagesService) {
    return AboutmessagesService.get({
      aboutmessageId: $stateParams.aboutmessageId
    }).$promise;
  }
}());
