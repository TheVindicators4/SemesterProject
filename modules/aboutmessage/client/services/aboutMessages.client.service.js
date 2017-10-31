(function () {
  'use strict';

  angular
    .module('aboutMessages.services')
    .factory('AboutMessagesService', AboutMessagesService);

  AboutMessagesService.$inject = ['$resource', '$log'];

  function AboutMessagesService($resource, $log) {
    var AboutMessage = $resource('/api/aboutMessages/:aboutMessageId', {
      aboutMessageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(AboutMessage.prototype, {
      createOrUpdate: function () {
        var aboutMessage = this;
        return createOrUpdate(aboutMessage);
      }
    });

    return AboutMessage;

    function createOrUpdate(aboutMessage) {
      if (aboutMessage._id) {
        return aboutMessage.$update(onSuccess, onError);
      } else {
        return aboutMessage.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(aboutMessage) {
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
