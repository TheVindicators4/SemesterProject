(function () {
  'use strict';

  angular
    .module('contacts')
    .controller('ContactsListController', ContactsListController);

  ContactsListController.$inject = ['ContactsService'];

  function ContactsListController(ContactsService) {
    var vm = this;

    vm.contacts = ContactsService.query();
  }
}());
