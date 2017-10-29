(function () {
  'use strict';

  angular
    .module('eventstream')
    .controller('EventstreamListController', EventstreamListController);

  EventstreamListController.$inject = ['EventstreamService'];

  function EventstreamListController(EventstreamService) {
    var vm = this;

    vm.eventstream = EventstreamService.query();
  }
}());
