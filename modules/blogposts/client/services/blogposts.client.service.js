// Blogposts service used to communicate Blogposts REST endpoints
(function () {
  'use strict';

  angular
    .module('blogposts')
    .factory('BlogpostsService', BlogpostsService);

  BlogpostsService.$inject = ['$resource'];

  function BlogpostsService($resource) {
    return $resource('api/blogposts/:blogpostId', {
      blogpostId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
