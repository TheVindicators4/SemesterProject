(function () {
  'use strict';

  angular
    .module('aboutMessages.admin')
    .controller('AboutMessagesAdminController', AboutMessagesAdminController);

  AboutMessagesAdminController.$inject = ['$scope', '$state', '$window', 'aboutMessageResolve', 'Authentication', 'Notification'];

  function AboutMessagesAdminController($scope, $state, $window, aboutMessage, Authentication, Notification) {
    var vm = this;

    vm.aboutMessage = aboutMessage;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing AboutMessage
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.aboutMessage.$remove(function () {
          $state.go('admin.aboutMessages.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> AboutMessage deleted successfully!' });
        });
      }
    }

    // Save AboutMessage
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.aboutMessageForm');
        return false;
      }

      // Create a new aboutMessage, or update the current instance
      vm.aboutMessage.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.aboutMessages.list'); // should we send the User to the list or the updated AboutMessage's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> AboutMessage saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> AboutMessage save error!' });
      }
    }
  }
}());
