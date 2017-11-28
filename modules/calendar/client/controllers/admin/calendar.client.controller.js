(function () {
  'use strict';

  angular
    .module('calendars.admin')
    .controller('CalendarsAdminController', CalendarsAdminController);

  CalendarsAdminController.$inject = ['$scope', '$state', '$window', 'calendarResolve', 'Authentication', 'Notification'];

  function CalendarsAdminController($scope, $state, $window, calendar, Authentication, Notification) {
    var vm = this;

    vm.calendar = calendar;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Calendar
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.calendar.$remove(function () {
          $state.go('admin.calendars.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Calendar deleted successfully!' });
        });
      }
    }

    // Save Calendar
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.calendarForm');
        return false;
      }

      // Create a new calendar, or update the current instance
      vm.calendar.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.calendars.list'); // should we send the User to the list or the updated Calendar's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Calendar saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Calendar save error!' });
      }
    }
  }
}());
