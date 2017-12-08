(function () {
  'use strict';

  angular
    .module('aboutmessages')
    .controller('AboutmessagesListController', AboutmessagesListController);

  AboutmessagesListController.$inject = ['AboutmessagesService'];

  // Controller for About Messages List
  function AboutmessagesListController(AboutmessagesService) {
    var vm = this;

    vm.aboutmessages = AboutmessagesService.query();
  }
}());
