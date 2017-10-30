(function () {
  'use strict';

  angular
    .module('blogposts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.blogposts', {
        abstract: true,
        url: '/blogposts',
        template: '<ui-view/>'
      })
      .state('admin.blogposts.list', {
        url: '',
        templateUrl: '/modules/blog/client/views/admin/list-blogposts.client.view.html',
        controller: 'BlogpostsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.blogposts.create', {
        url: '/create',
        templateUrl: '/modules/blog/client/views/admin/form-blogpost.client.view.html',
        controller: 'BlogpostsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          blogpostResolve: newBlogpost
        }
      })
      .state('admin.blogposts.edit', {
        url: '/:blogpostId/edit',
        templateUrl: '/modules/blog/client/views/admin/form-blogpost.client.view.html',
        controller: 'BlogpostsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ blogpostResolve.title }}'
        },
        resolve: {
          blogpostResolve: getBlogpost
        }
      });
  }

  getBlogpost.$inject = ['$stateParams', 'BlogpostsService'];

  function getBlogpost($stateParams, BlogpostsService) {
    return BlogpostsService.get({
      blogpostId: $stateParams.blogpostId
    }).$promise;
  }

  newBlogpost.$inject = ['BlogpostsService'];

  function newBlogpost(BlogpostsService) {
    return new BlogpostsService();
  }
}());
