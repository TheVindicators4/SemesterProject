(function () {
  'use strict';

  angular
    .module('shops.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  // Configures routes to admin side of the shop page
  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.shops', {
        abstract: true,
        url: '/shops',
        template: '<ui-view/>'
      })
      .state('admin.shops.list', {
        url: '',
        templateUrl: '/modules/shops/client/views/admin/list-shops.client.view.html',
        controller: 'ShopsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.shops.create', {
        url: '/create',
        templateUrl: '/modules/shops/client/views/admin/form-shop.client.view.html',
        controller: 'ShopsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          shopResolve: newShop
        }
      })
      .state('admin.shops.edit', {
        url: '/:shopId/edit',
        templateUrl: '/modules/shops/client/views/admin/form-shop.client.view.html',
        controller: 'ShopsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ shopResolve.title }}'
        },
        resolve: {
          shopResolve: getShop
        }
      });
  }

  getShop.$inject = ['$stateParams', 'ShopsService'];

  function getShop($stateParams, ShopsService) {
    return ShopsService.get({
      shopId: $stateParams.shopId
    }).$promise;
  }

  newShop.$inject = ['ShopsService'];

  function newShop(ShopsService) {
    return new ShopsService();
  }
}());
