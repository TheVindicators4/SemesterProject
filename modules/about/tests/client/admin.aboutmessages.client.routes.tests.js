(function () {
  'use strict';

  describe('Aboutmessages Route Tests', function () {
    // Initialize global variables
    var $scope,
      AboutmessagesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AboutmessagesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AboutmessagesService = _AboutmessagesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.aboutmessages');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/aboutmessages');
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
          liststate = $state.get('admin.aboutmessages.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/about/client/views/admin/list-aboutmessages.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AboutmessagesAdminController,
          mockAboutmessage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.aboutmessages.create');
          $templateCache.put('/modules/about/client/views/admin/form-aboutmessage.client.view.html', '');

          // Create mock aboutmessage
          mockAboutmessage = new AboutmessagesService();

          // Initialize Controller
          AboutmessagesAdminController = $controller('AboutmessagesAdminController as vm', {
            $scope: $scope,
            aboutmessageResolve: mockAboutmessage
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.aboutmessageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/aboutmessages/create');
        }));

        it('should attach an aboutmessage to the controller scope', function () {
          expect($scope.vm.aboutmessage._id).toBe(mockAboutmessage._id);
          expect($scope.vm.aboutmessage._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/about/client/views/admin/form-aboutmessage.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AboutmessagesAdminController,
          mockAboutmessage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.aboutmessages.edit');
          $templateCache.put('/modules/about/client/views/admin/form-aboutmessage.client.view.html', '');

          // Create mock aboutmessage
          mockAboutmessage = new AboutmessagesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Aboutmessage about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AboutmessagesAdminController = $controller('AboutmessagesAdminController as vm', {
            $scope: $scope,
            aboutmessageResolve: mockAboutmessage
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:aboutmessageId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.aboutmessageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            aboutmessageId: 1
          })).toEqual('/admin/aboutmessages/1/edit');
        }));

        it('should attach an aboutmessage to the controller scope', function () {
          expect($scope.vm.aboutmessage._id).toBe(mockAboutmessage._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/about/client/views/admin/form-aboutmessage.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
