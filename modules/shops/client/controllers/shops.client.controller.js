(function () {
  'use strict';

  angular
    .module('shops')
    .controller('ShopsController', ShopsController);

  ShopsController.$inject = ['$scope', 'shopResolve', 'Authentication'];

  function ShopsController($scope, shop, Authentication) {
    var vm = this;

    vm.shop = shop;
    vm.authentication = Authentication;

  }
}());
