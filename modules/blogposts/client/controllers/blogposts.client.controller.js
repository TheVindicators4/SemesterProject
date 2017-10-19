(function () {
  'use strict';

  // Blogposts controller
  angular
    .module('blogposts')
    .controller('BlogpostsController', BlogpostsController);

  BlogpostsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'blogpostResolve'];

  function BlogpostsController ($scope, $state, $window, Authentication, blogpost) {
    var vm = this;

    vm.authentication = Authentication;
    vm.blogpost = blogpost;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Blogpost
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.blogpost.$remove($state.go('blogposts.list'));
      }
    }

    // Save Blogpost
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.blogpostForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.blogpost._id) {
        vm.blogpost.$update(successCallback, errorCallback);
      } else {
        vm.blogpost.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('blogposts.view', {
          blogpostId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
