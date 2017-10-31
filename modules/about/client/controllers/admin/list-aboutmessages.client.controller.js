(function () {
  'use strict';

  angular
    .module('aboutmessages.admin')
    .controller('AboutmessagesAdminListController', AboutmessagesAdminListController);

  AboutmessagesAdminListController.$inject = ['AboutmessagesService'];

  function AboutmessagesAdminListController(AboutmessagesService) {
    var vm = this;

    vm.aboutmessages = AboutmessagesService.query();
  }
}());
