(function () {
  'use strict';

  angular
    .module('blogposts.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('blogposts', {
        abstract: true,
        url: '/blogposts',
        template: '<ui-view/>'
      })
      .state('blogposts.list', {
        url: '',
        templateUrl: '/modules/blog/client/views/list-blogposts.client.view.html',
        controller: 'BlogpostsListController',
        controllerAs: 'vm'
      })
      .state('blogposts.view', {
        url: '/:blogpostId',
        templateUrl: '/modules/blog/client/views/view-blogpost.client.view.html',
        controller: 'BlogpostsController',
        controllerAs: 'vm',
        resolve: {
          blogpostResolve: getBlogpost
        },
        data: {
          pageTitle: '{{ blogpostResolve.title }}'
        }
      });
  }

  getBlogpost.$inject = ['$stateParams', 'BlogpostsService'];

  function getBlogpost($stateParams, BlogpostsService) {
    return BlogpostsService.get({
      blogpostId: $stateParams.blogpostId
    }).$promise;
  }
}());
