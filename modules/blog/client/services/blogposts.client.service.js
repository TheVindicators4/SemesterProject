(function () {
  'use strict';

  angular
    .module('blogposts.services')
    .factory('BlogpostsService', BlogpostsService);

  BlogpostsService.$inject = ['$resource', '$log'];

  function BlogpostsService($resource, $log) {
    var Blogpost = $resource('/api/blogposts/:blogpostId', {
      blogpostId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Blogpost.prototype, {
      createOrUpdate: function () {
        var blogpost = this;
        return createOrUpdate(blogpost);
      }
    });

    return Blogpost;

    function createOrUpdate(blogpost) {
      if (blogpost._id) {
        return blogpost.$update(onSuccess, onError);
      } else {
        return blogpost.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(blogpost) {
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
