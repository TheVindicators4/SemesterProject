(function () {
  'use strict';

  angular
    .module('shops.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('shops', {
        abstract: true,
        url: '/shops',
        template: '<ui-view/>'
      })
      .state('shops.list', {
        url: '',
        templateUrl: '/modules/shops/client/views/list-shops.client.view.html',
        controller: 'ShopsListController',
        controllerAs: 'vm'
      })
      .state('shops.view', {
        url: '/:shopId',
        templateUrl: '/modules/shops/client/views/view-shop.client.view.html',
        controller: 'ShopsController',
        controllerAs: 'vm',
        resolve: {
          shopResolve: getShop
        },
        data: {
          pageTitle: '{{ shopResolve.title }}'
        }
      });
  }

  getShop.$inject = ['$stateParams', 'ShopsService'];

  function getShop($stateParams, ShopsService) {
    return ShopsService.get({
      shopId: $stateParams.shopId
    }).$promise;
  }
}());
