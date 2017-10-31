(function () {
  'use strict';

  angular
    .module('blogpost')
    .controller('BlogpostController', BlogpostController);

  BlogpostController.$inject = ['$scope', 'blogpostResolve', 'Authentication'];

  function BlogpostController($scope, blogpost, Authentication) {
    var vm = this;

    vm.blogpost = blogpost;
    vm.authentication = Authentication;

  }
}());
