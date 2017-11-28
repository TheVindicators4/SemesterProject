(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsController', CalendarsController);

  CalendarsController.$inject = ['$scope', 'calendarResolve', 'Authentication'];

  function CalendarsController($scope, calendar, Authentication) {
    var vm = this;

    vm.calendar = calendar;
    vm.authentication = Authentication;

  }
}());
