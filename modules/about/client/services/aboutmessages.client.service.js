(function () {
  'use strict';

  angular
    .module('aboutmessages.services')
    .factory('AboutmessagesService', AboutmessagesService);

  AboutmessagesService.$inject = ['$resource', '$log'];

  function AboutmessagesService($resource, $log) {
    var Aboutmessage = $resource('/api/aboutmessages/:aboutmessageId', {
      aboutmessageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Aboutmessage.prototype, {
      createOrUpdate: function () {
        var aboutmessage = this;
        return createOrUpdate(aboutmessage);
      }
    });

    return Aboutmessage;

    function createOrUpdate(aboutmessage) {
      if (aboutmessage._id) {
        return aboutmessage.$update(onSuccess, onError);
      } else {
        return aboutmessage.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(aboutmessage) {
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
