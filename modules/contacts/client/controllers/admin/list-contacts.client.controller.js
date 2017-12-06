(function () {
  'use strict';

  angular
    .module('contacts.admin')
    .controller('ContactsAdminListController', ContactsAdminListController);

  ContactsAdminListController.$inject = ['ContactsService'];

  function ContactsAdminListController(ContactsService) {
    var vm = this;

    vm.contacts = ContactsService.query();
  }
}());
