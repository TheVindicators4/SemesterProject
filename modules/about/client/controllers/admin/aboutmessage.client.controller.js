(function () {
  'use strict';

  angular
    .module('aboutmessages.admin')
    .controller('AboutmessagesAdminController', AboutmessagesAdminController);

  AboutmessagesAdminController.$inject = ['$scope', '$state', '$window', 'aboutmessageResolve', 'Authentication', 'Notification'];

  function AboutmessagesAdminController($scope, $state, $window, aboutmessage, Authentication, Notification) {
    var vm = this;

    vm.aboutmessage = aboutmessage;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Aboutmessage
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.aboutmessage.$remove(function () {
          $state.go('admin.aboutmessages.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Aboutmessage deleted successfully!' });
        });
      }
    }

    // Save Aboutmessage
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.aboutmessageForm');
        return false;
      }

      // Create a new aboutmessage, or update the current instance
      vm.aboutmessage.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.aboutmessages.list'); // should we send the User to the list or the updated Aboutmessage's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Aboutmessage saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Aboutmessage save error!' });
      }
    }
  }
}());
