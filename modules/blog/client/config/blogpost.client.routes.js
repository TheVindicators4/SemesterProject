(function () {
  'use strict';

  angular
    .module('blogpost.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('blogpost', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('blogpost.list', {
        url: '/blog',
        templateUrl: '/modules/blog/client/views/list-blogpost.client.view.html',
        controller: 'BlogpostListController',
        controllerAs: 'vm'
      })
      .state('blogpost.view', {
        url: '/:blogpostId',
        templateUrl: '/modules/blog/client/views/view-blogpost.client.view.html',
        controller: 'BlogpostController',
        controllerAs: 'vm',
        resolve: {
          blogpostResolve: getBlogpost
        },
        data: {
          pageTitle: '{{ blogpostResolve.title }}'
        }
      });
  }

  getBlogpost.$inject = ['$stateParams', 'BlogpostService'];

  function getBlogpost($stateParams, BlogpostService) {
    return BlogpostService.get({
      blogpostId: $stateParams.blogpostId
    }).$promise;
  }
}());
