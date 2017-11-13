(function () {
  'use strict';

  angular
    .module('shops.admin')
    .controller('ShopsAdminListController', ShopsAdminListController);

  ShopsAdminListController.$inject = ['ShopsService'];

  function ShopsAdminListController(ShopsService) {
    var vm = this;

    vm.shops = ShopsService.query();
  }
}());
