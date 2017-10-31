(function () {
  'use strict';

  angular
    .module('email.admin')
    .controller('EmailAdminListController', EmailAdminListController);

  EmailAdminListController.$inject = ['EmailService'];

  function EmailAdminListController(EmailService) {
    var vm = this;

    vm.email = EmailService.query();
  }
}());
