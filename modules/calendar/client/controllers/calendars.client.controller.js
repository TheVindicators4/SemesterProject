(function () {
  'use strict';

  angular
  .module('calendars')
  .controller('CalendarsController', CalendarsController);

  CalendarsController.$inject = ['$scope', '$state', '$window', 'calendarResolve', 'Authentication', 'Notification'];

  function CalendarsController($scope, $state, $window, review, Authentication, Notification) {
    var vm = this;

    vm.calendar = calendar;
    vm.authentication = Authentication;
    vm.form = {};
    vm.save = save;

    // Save Review
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactForm');
        return false;
      }

      // Create a new review, or update the current instance
      //vm.review.user = 'guest';
      vm.calendar.createOrUpdate()
      .then(successCallback)
      .catch(errorCallback);

      function successCallback(res) {
        $state.go('calendars.list'); // should we send the User to the list or the updated Review's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Your submission has been saved successfully! Thank you.' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Save error!' });
      }
    }
  }

}());
