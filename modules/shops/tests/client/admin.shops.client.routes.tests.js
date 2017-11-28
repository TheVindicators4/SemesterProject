(function () {
  'use strict';

  describe('Shops Route Tests', function () {
    // Initialize global variables
    var $scope,
      ShopsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ShopsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ShopsService = _ShopsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.shops');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/shops');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.shops.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/shops/client/views/admin/list-shops.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ShopsAdminController,
          mockShop;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.shops.create');
          $templateCache.put('/modules/shops/client/views/admin/form-shop.client.view.html', '');

          // Create mock shop
          mockShop = new ShopsService();

          // Initialize Controller
          ShopsAdminController = $controller('ShopsAdminController as vm', {
            $scope: $scope,
            shopResolve: mockShop
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.shopResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/shops/create');
        }));

        it('should attach an shop to the controller scope', function () {
          expect($scope.vm.shop._id).toBe(mockShop._id);
          expect($scope.vm.shop._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/shops/client/views/admin/form-shop.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ShopsAdminController,
          mockShop;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.shops.edit');
          $templateCache.put('/modules/shops/client/views/admin/form-shop.client.view.html', '');

          // Create mock shop
          mockShop = new ShopsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Shop about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ShopsAdminController = $controller('ShopsAdminController as vm', {
            $scope: $scope,
            shopResolve: mockShop
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:shopId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.shopResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            shopId: 1
          })).toEqual('/admin/shops/1/edit');
        }));

        it('should attach an shop to the controller scope', function () {
          expect($scope.vm.shop._id).toBe(mockShop._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/shops/client/views/admin/form-shop.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
