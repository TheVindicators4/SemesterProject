(function () {
  'use strict';

  angular
    .module('aboutmessages')
    .controller('AboutmessagesListController', AboutmessagesListController);

  AboutmessagesListController.$inject = ['AboutmessagesService'];

  function AboutmessagesListController(AboutmessagesService) {
    var vm = this;

    vm.aboutmessages = AboutmessagesService.query();
  }
}());
