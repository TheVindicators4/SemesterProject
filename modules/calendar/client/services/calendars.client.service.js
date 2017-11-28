(function () {
  'use strict';

  angular
    .module('calendars.services')
    .factory('CalendarsService', CalendarsService);

  CalendarsService.$inject = ['$resource', '$log'];

  function CalendarsService($resource, $log) {
    var Calendar = $resource('/api/calendars/:calendarId', {
      calendarId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Calendar.prototype, {
      createOrUpdate: function () {
        var calendar = this;
        return createOrUpdate(calendar);
      }
    });

    return Calendar;

    function createOrUpdate(calendar) {
      if (calendar._id) {
        return calendar.$update(onSuccess, onError);
      } else {
        return calendar.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(calendar) {
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
