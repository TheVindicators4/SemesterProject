(function () {
  'use strict';

  angular
    .module('shops.admin')
    .controller('ShopsAdminController', ShopsAdminController);

  ShopsAdminController.$inject = ['$scope', '$state', '$window', 'shopResolve', 'Authentication', 'Notification'];

  function ShopsAdminController($scope, $state, $window, shop, Authentication, Notification) {
    var vm = this;

    vm.shop = shop;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Shop
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shop.$remove(function () {
          $state.go('admin.shops.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shop deleted successfully!' });
        });
      }
    }

    // Save Shop
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shopForm');
        return false;
      }

      // Create a new shop, or update the current instance
      vm.shop.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.shops.list'); // should we send the User to the list or the updated Shop's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shop saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Shop save error!' });
      }
    }
  }
}());
