(function () {
  'use strict';

  angular
    .module('reviews.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.reviews', {
        abstract: true,
        url: '/reviews',
        template: '<ui-view/>'
      })
      .state('admin.reviews.list', {
        url: '',
        templateUrl: '/modules/reviews/client/views/admin/list-reviews.client.view.html',
        controller: 'ReviewsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.reviews.create', {
        url: '/create',
        templateUrl: '/modules/reviews/client/views/admin/form-review.client.view.html',
        controller: 'ReviewsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          reviewResolve: newReview
        }
      })
      .state('admin.reviews.edit', {
        url: '/:reviewId/edit',
        templateUrl: '/modules/reviews/client/views/admin/form-review.client.view.html',
        controller: 'ReviewsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ reviewResolve.title }}'
        },
        resolve: {
          reviewResolve: getReview
        }
      });
  }

  getReview.$inject = ['$stateParams', 'ReviewsService'];

  function getReview($stateParams, ReviewsService) {
    return ReviewsService.get({
      reviewId: $stateParams.reviewId
    }).$promise;
  }

  newReview.$inject = ['ReviewsService'];

  function newReview(ReviewsService) {
    return new ReviewsService();
  }
}());
