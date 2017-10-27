(function () {
  'use strict';

  angular
    .module('blogposts')
    .controller('BlogpostsController', BlogpostsController);

  BlogpostsController.$inject = ['$scope', 'blogpostResolve', 'Authentication'];

  function BlogpostsController($scope, blogpost, Authentication) {
    var vm = this;

    vm.blogpost = blogpost;
    vm.authentication = Authentication;

  }
}());
