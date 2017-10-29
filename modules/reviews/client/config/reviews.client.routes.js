(function () {
  'use strict';

  angular
    .module('reviews.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reviews', {
        abstract: true,
        url: '/reviews',
        template: '<ui-view/>'
      })
      .state('reviews.list', {
        url: '',
        templateUrl: '/modules/reviews/client/views/list-reviews.client.view.html',
        controller: 'ReviewsListController',
        controllerAs: 'vm'
      })
      .state('reviews.view', {
        url: '/:reviewId',
        templateUrl: '/modules/reviews/client/views/view-review.client.view.html',
        controller: 'ReviewsController',
        controllerAs: 'vm',
        resolve: {
          reviewResolve: getReview
        },
        data: {
          pageTitle: '{{ reviewResolve.title }}'
        }
      });
  }

  getReview.$inject = ['$stateParams', 'ReviewsService'];

  function getReview($stateParams, ReviewsService) {
    return ReviewsService.get({
      reviewId: $stateParams.reviewId
    }).$promise;
  }
}());
