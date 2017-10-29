(function () {
  'use strict';

  angular
    .module('eventstream.admin')
    .controller('EventstreamAdminController', EventstreamAdminController);

  EventstreamAdminController.$inject = ['$scope', '$state', '$window', 'eventstreamResolve', 'Authentication', 'Notification'];

  function EventstreamAdminController($scope, $state, $window, eventstream, Authentication, Notification) {
    var vm = this;

    vm.eventstream = eventstream;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Eventstream
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.eventstream.$remove(function () {
          $state.go('admin.eventstream.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Eventstream deleted successfully!' });
        });
      }
    }

    // Save Eventstream
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventstreamForm');
        return false;
      }

      // Create a new eventstream, or update the current instance
      vm.eventstream.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.eventstream.list'); // should we send the User to the list or the updated Eventstream's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Eventstream saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Eventstream save error!' });
      }
    }
  }
}());
