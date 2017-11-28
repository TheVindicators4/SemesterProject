(function () {
  'use strict';

  angular
    .module('calendars.admin')
    .controller('CalendarsAdminListController', CalendarsAdminListController);

  CalendarsAdminListController.$inject = ['CalendarsService'];

  function CalendarsAdminListController(CalendarsService) {
    var vm = this;

    vm.calendars = CalendarsService.query();
  }
}());
