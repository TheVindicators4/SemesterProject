(function () {
  'use strict';

  angular
  .module('contacts.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

    // configures routes for contacts
  function routeConfig($stateProvider) {
    $stateProvider
    .state('contacts', {
      abstract: true,
      url: '/contacts',
      template: '<ui-view/>'
    })
    .state('contacts.list', {
      url: '/list',
      templateUrl: '/modules/contacts/client/views/list-contacts.client.view.html',
      controller: 'ContactsListController',
      controllerAs: 'vm'
    })
    .state('contacts.create', {
      url: '/create',
      templateUrl: '/modules/contacts/client/views/create-contact.client.view.html',
      controller: 'ContactsController',
      controllerAs: 'vm',
      data: {
        roles: ['guest']
      },
      resolve: {
        contactResolve: newContact
      }
    })
    .state('contacts.view', {
      url: '/:contactId',
      templateUrl: '/modules/contacts/client/views/view-contact.client.view.html',
      controller: 'ContactsController',
      controllerAs: 'vm',
      resolve: {
        contactResolve: getContact
      },
      data: {
        pageTitle: '{{ contactResolve.title }}'
      }
    });
  }

  getContact.$inject = ['$stateParams', 'ContactsService'];

  function getContact($stateParams, ContactsService) {
    return ContactsService.get({
      contactId: $stateParams.contactId
    }).$promise;
  }


  newContact.$inject = ['ContactsService'];

  function newContact(ContactsService) {
    return new ContactsService();
  }


}());
