(function () {
  'use strict';

  describe('AboutMessages Route Tests', function () {
    // Initialize global variables
    var $scope,
      AboutMessagesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AboutMessagesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AboutMessagesService = _AboutMessagesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.aboutMessages');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/aboutMessages');
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
          liststate = $state.get('admin.aboutMessages.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/aboutMessages/client/views/admin/list-aboutMessages.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AboutMessagesAdminController,
          mockAboutMessage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.aboutMessages.create');
          $templateCache.put('/modules/aboutMessages/client/views/admin/form-aboutMessage.client.view.html', '');

          // Create mock aboutMessage
          mockAboutMessage = new AboutMessagesService();

          // Initialize Controller
          AboutMessagesAdminController = $controller('AboutMessagesAdminController as vm', {
            $scope: $scope,
            aboutMessageResolve: mockAboutMessage
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.aboutMessageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/aboutMessages/create');
        }));

        it('should attach an aboutMessage to the controller scope', function () {
          expect($scope.vm.aboutMessage._id).toBe(mockAboutMessage._id);
          expect($scope.vm.aboutMessage._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/aboutMessages/client/views/admin/form-aboutMessage.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AboutMessagesAdminController,
          mockAboutMessage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.aboutMessages.edit');
          $templateCache.put('/modules/aboutMessages/client/views/admin/form-aboutMessage.client.view.html', '');

          // Create mock aboutMessage
          mockAboutMessage = new AboutMessagesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An AboutMessage about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AboutMessagesAdminController = $controller('AboutMessagesAdminController as vm', {
            $scope: $scope,
            aboutMessageResolve: mockAboutMessage
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:aboutMessageId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.aboutMessageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            aboutMessageId: 1
          })).toEqual('/admin/aboutMessages/1/edit');
        }));

        it('should attach an aboutMessage to the controller scope', function () {
          expect($scope.vm.aboutMessage._id).toBe(mockAboutMessage._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/aboutMessages/client/views/admin/form-aboutMessage.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
