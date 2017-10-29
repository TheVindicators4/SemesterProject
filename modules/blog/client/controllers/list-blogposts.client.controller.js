(function () {
  'use strict';

  angular
    .module('blogposts')
    .controller('BlogpostsListController', BlogpostsListController);

  BlogpostsListController.$inject = ['BlogpostsService'];

  function BlogpostsListController(BlogpostsService) {
    var vm = this;

    vm.blogposts = BlogpostsService.query();
  }
}());
