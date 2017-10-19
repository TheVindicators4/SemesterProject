(function () {
  'use strict';

  angular
    .module('blogposts')
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
        templateUrl: 'modules/blogposts/client/views/list-blogposts.client.view.html',
        controller: 'BlogpostsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Blogposts List'
        }
      })
      .state('blogposts.create', {
        url: '/create',
        templateUrl: 'modules/blogposts/client/views/form-blogpost.client.view.html',
        controller: 'BlogpostsController',
        controllerAs: 'vm',
        resolve: {
          blogpostResolve: newBlogpost
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Blogposts Create'
        }
      })
      .state('blogposts.edit', {
        url: '/:blogpostId/edit',
        templateUrl: 'modules/blogposts/client/views/form-blogpost.client.view.html',
        controller: 'BlogpostsController',
        controllerAs: 'vm',
        resolve: {
          blogpostResolve: getBlogpost
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Blogpost {{ blogpostResolve.name }}'
        }
      })
      .state('blogposts.view', {
        url: '/:blogpostId',
        templateUrl: 'modules/blogposts/client/views/view-blogpost.client.view.html',
        controller: 'BlogpostsController',
        controllerAs: 'vm',
        resolve: {
          blogpostResolve: getBlogpost
        },
        data: {
          pageTitle: 'Blogpost {{ blogpostResolve.name }}'
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
