(function () {
  'use strict';

  angular
    .module('shops.services')
    .factory('ShopsService', ShopsService);

  ShopsService.$inject = ['$resource', '$log'];

  function ShopsService($resource, $log) {
    var Shop = $resource('/api/shops/:shopId', {
      shopId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Shop.prototype, {
      createOrUpdate: function () {
        var shop = this;
        return createOrUpdate(shop);
      }
    });

    return Shop;

    function createOrUpdate(shop) {
      if (shop._id) {
        return shop.$update(onSuccess, onError);
      } else {
        return shop.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(shop) {
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
