(function () {
  'use strict';

  angular
    .module('eventstream.admin')
    .controller('EventstreamAdminListController', EventstreamAdminListController);

  EventstreamAdminListController.$inject = ['EventstreamService'];

  function EventstreamAdminListController(EventstreamService) {
    var vm = this;

    vm.eventstream = EventstreamService.query();
  }
}());
