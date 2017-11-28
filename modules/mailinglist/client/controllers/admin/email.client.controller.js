(function () {
  'use strict';

  angular
    .module('email.admin')
    .controller('EmailAdminController', EmailAdminController);

  EmailAdminController.$inject = ['$scope', '$state', '$window', 'emailResolve', 'Authentication', 'Notification'];

  function EmailAdminController($scope, $state, $window, email, Authentication, Notification) {
    var vm = this;

    vm.email = email;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Email
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.email.$remove(function () {
          $state.go('admin.email.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Email deleted successfully!' });
        });
      }
    }

    // Save Email
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.emailForm');
        return false;
      }

      // Create a new email, or update the current instance
      vm.email.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.email.list'); // should we send the User to the list or the updated Email's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Email saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Email save error!' });
      }
    }
  }
}());
