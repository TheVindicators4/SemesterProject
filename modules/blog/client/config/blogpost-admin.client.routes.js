(function () {
  'use strict';

  angular
    .module('blogpost.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.blogpost', {
        abstract: true,
        url: '/blogpost',
        template: '<ui-view/>'
      })
      .state('admin.blogpost.list', {
        url: '',
        templateUrl: '/modules/blog/client/views/admin/list-blogpost.client.view.html',
        controller: 'BlogpostAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.blogpost.create', {
        url: '/create',
        templateUrl: '/modules/blog/client/views/admin/form-blogpost.client.view.html',
        controller: 'BlogpostAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          blogpostResolve: newBlogpost
        }
      })
      .state('admin.blogpost.edit', {
        url: '/:blogpostId/edit',
        templateUrl: '/modules/blog/client/views/admin/form-blogpost.client.view.html',
        controller: 'BlogpostAdminController',
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

  getBlogpost.$inject = ['$stateParams', 'BlogpostService'];

  function getBlogpost($stateParams, BlogpostService) {
    return BlogpostService.get({
      blogpostId: $stateParams.blogpostId
    }).$promise;
  }

  newBlogpost.$inject = ['BlogpostService'];

  function newBlogpost(BlogpostService) {
    return new BlogpostService();
  }
}());
