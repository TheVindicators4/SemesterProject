(function () {
  'use strict';

  angular
    .module('aboutMessages.admin')
    .controller('AboutMessagesAdminListController', AboutMessagesAdminListController);

  AboutMessagesAdminListController.$inject = ['AboutMessagesService'];

  function AboutMessagesAdminListController(AboutMessagesService) {
    var vm = this;

    vm.aboutMessages = AboutMessagesService.query();
  }
}());
