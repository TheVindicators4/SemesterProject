(function () {
  'use strict';

  angular
  .module('contacts.admin.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  // configures routes for contacts for admin side
  function routeConfig($stateProvider) {
    $stateProvider
    .state('admin.contacts', {
      abstract: true,
      url: '/contacts',
      template: '<ui-view/>'
    })
    .state('admin.contacts.list', {
      url: '',
      templateUrl: '/modules/contacts/client/views/admin/list-contacts.client.view.html',
      controller: 'ContactsAdminListController',
      controllerAs: 'vm',
      data: {
        roles: ['admin']
      }
    })
    .state('admin.contacts.view', {
      url: '',
      templateUrl: '/modules/contacts/client/views/admin/view-contact.client.view.html',
      controller: 'ContactsAdminListController',
      controllerAs: 'vm',
      data: {
        roles: ['admin']
      }
    })
    .state('admin.contacts.create', {
      url: '/create',
      templateUrl: '/modules/contacts/client/views/admin/form-contact.client.view.html',
      controller: 'ContactsAdminController',
      controllerAs: 'vm',
      data: {
        roles: ['admin']
      },
      resolve: {
        contactResolve: newContact
      }
    })
    .state('admin.contacts.edit', {
      url: '/:contactId/edit',
      templateUrl: '/modules/contacts/client/views/admin/form-contact.client.view.html',
      controller: 'ContactsAdminController',
      controllerAs: 'vm',
      data: {
        roles: ['admin'],
        pageTitle: '{{ contactResolve.title }}'
      },
      resolve: {
        contactResolve: getContact
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
