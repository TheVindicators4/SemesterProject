(function () {
  'use strict';

  angular
    .module('reviews.services')
    .factory('ReviewsService', ReviewsService);

  ReviewsService.$inject = ['$resource', '$log'];

  function ReviewsService($resource, $log) {
    var Review = $resource('/api/reviews/:reviewId', {
      reviewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Review.prototype, {
      createOrUpdate: function () {
        var review = this;
        return createOrUpdate(review);
      }
    });

    return Review;

    function createOrUpdate(review) {
      if (review._id) {
        return review.$update(onSuccess, onError);
      } else {
        return review.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(review) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
