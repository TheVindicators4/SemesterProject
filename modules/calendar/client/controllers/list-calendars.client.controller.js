(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsListController', CalendarsListController);

  CalendarsListController.$inject = ['CalendarsService'];

  function CalendarsListController(CalendarsService) {
    var vm = this;

    vm.calendars = CalendarsService.query();
  }
}());
