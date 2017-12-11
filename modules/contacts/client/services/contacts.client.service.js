(function () {
  'use strict';

  angular
    .module('contacts.services')
    .factory('ContactsService', ContactsService);

  ContactsService.$inject = ['$resource', '$log'];

  function ContactsService($resource, $log) {
    var Contact = $resource('/api/contacts/:contactId', {
      contactId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Contact.prototype, {
      createOrUpdate: function () {
        var contact = this;
        return createOrUpdate(contact);
      }
    });

    return Contact;

    function createOrUpdate(contact) {
      if (contact._id) {
        return contact.$update(onSuccess, onError);
      } else {
        return contact.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(contact) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
