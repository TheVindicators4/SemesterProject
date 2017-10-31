(function () {
  'use strict';

  angular
    .module('blogpost.admin')
    .controller('BlogpostAdminController', BlogpostAdminController);

  BlogpostAdminController.$inject = ['$scope', '$state', '$window', 'blogpostResolve', 'Authentication', 'Notification'];

  function BlogpostAdminController($scope, $state, $window, blogpost, Authentication, Notification) {
    var vm = this;

    vm.blogpost = blogpost;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Blogpost
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.blogpost.$remove(function () {
          $state.go('admin.blogpost.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Blogpost deleted successfully!' });
        });
      }
    }

    // Save Blogpost
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.blogpostForm');
        return false;
      }

      // Create a new blogpost, or update the current instance
      vm.blogpost.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.blogpost.list'); // should we send the User to the list or the updated Blogpost's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Blogpost saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Blogpost save error!' });
      }
    }
  }
}());
