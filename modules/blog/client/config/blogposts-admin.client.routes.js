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
        controller: 'BlogPostsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.blogposts.create', {
        url: '/create',
        templateUrl: '/modules/blog/client/views/admin/form-blogpost.client.view.html',
        controller: 'BlogPostsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          blogpostResolve: newBlogPost
        }
      })
      .state('admin.blogposts.edit', {
        url: '/:blogpostId/edit',
        templateUrl: '/modules/blog/client/views/admin/form-blogpost.client.view.html',
        controller: 'BlogPostsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ blogpostResolve.title }}'
        },
        resolve: {
          blogpostResolve: getBlogPost
        }
      });
  }

  getBlogPost.$inject = ['$stateParams', 'BlogPostsService'];

  function getBlogPost($stateParams, BlogPostsService) {
    return BlogPostsService.get({
      blogpostId: $stateParams.blogpostId
    }).$promise;
  }

  newBlogPost.$inject = ['BlogPostsService'];

  function newBlogPost(BlogPostsService) {
    return new BlogPostsService();
  }
}());
