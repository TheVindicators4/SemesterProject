(function () {
  'use strict';

  angular
    .module('eventstream.services')
    .factory('EventstreamService', EventstreamService);

  EventstreamService.$inject = ['$resource', '$log'];

  function EventstreamService($resource, $log) {
    var Eventstream = $resource('/api/eventstream/:eventstreamId', {
      eventstreamId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Eventstream.prototype, {
      createOrUpdate: function () {
        var eventstream = this;
        return createOrUpdate(eventstream);
      }
    });

    return Eventstream;

    function createOrUpdate(eventstream) {
      if (eventstream._id) {
        return eventstream.$update(onSuccess, onError);
      } else {
        return eventstream.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(eventstream) {
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
