(function () {
  'use strict';

  angular
    .module('email.services')
    .factory('EmailService', EmailService);

  EmailService.$inject = ['$resource', '$log'];

  function EmailService($resource, $log) {
    var Email = $resource('/api/email/:emailId', {
      emailId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Email.prototype, {
      createOrUpdate: function () {
        var email = this;
        return createOrUpdate(email);
      }
    });

    return Email;

    function createOrUpdate(email) {
      if (email._id) {
        return email.$update(onSuccess, onError);
      } else {
        return email.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(email) {
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
