(function () {
  'use strict';

  angular
    .module('eventstream')
    .controller('EventstreamController', EventstreamController);

  EventstreamController.$inject = ['$scope', 'eventstreamResolve', 'Authentication'];

  function EventstreamController($scope, eventstream, Authentication) {
    var vm = this;

    vm.eventstream = eventstream;
    vm.authentication = Authentication;

  }
}());
