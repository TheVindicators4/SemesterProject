(function () {
  'use strict';

  angular
    .module('email')
    .controller('EmailListController', EmailListController);

  EmailListController.$inject = ['EmailService'];

  function EmailListController(EmailService) {
    var vm = this;

    vm.email = EmailService.query();
  }
}());
