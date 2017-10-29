(function () {
  'use strict';

  angular
    .module('aboutMessages')
    .controller('AboutMessagesListController', AboutMessagesListController);

  AboutMessagesListController.$inject = ['AboutMessagesService'];

  function AboutMessagesListController(AboutMessagesService) {
    var vm = this;

    vm.aboutMessages = AboutMessagesService.query();
  }
}());
