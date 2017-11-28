(function () {
  'use strict';

  describe('Eventstream Route Tests', function () {
    // Initialize global variables
    var $scope,
      EventstreamService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EventstreamService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EventstreamService = _EventstreamService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.eventstream');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/eventstream');
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
          liststate = $state.get('admin.eventstream.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/eventstream/client/views/admin/list-eventstream.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EventstreamAdminController,
          mockEventstream;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.eventstream.create');
          $templateCache.put('/modules/eventstream/client/views/admin/form-eventstream.client.view.html', '');

          // Create mock eventstream
          mockEventstream = new EventstreamService();

          // Initialize Controller
          EventstreamAdminController = $controller('EventstreamAdminController as vm', {
            $scope: $scope,
            eventstreamResolve: mockEventstream
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.eventstreamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/eventstream/create');
        }));

        it('should attach an eventstream to the controller scope', function () {
          expect($scope.vm.eventstream._id).toBe(mockEventstream._id);
          expect($scope.vm.eventstream._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/eventstream/client/views/admin/form-eventstream.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EventstreamAdminController,
          mockEventstream;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.eventstream.edit');
          $templateCache.put('/modules/eventstream/client/views/admin/form-eventstream.client.view.html', '');

          // Create mock eventstream
          mockEventstream = new EventstreamService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Eventstream about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          EventstreamAdminController = $controller('EventstreamAdminController as vm', {
            $scope: $scope,
            eventstreamResolve: mockEventstream
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:eventstreamId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.eventstreamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            eventstreamId: 1
          })).toEqual('/admin/eventstream/1/edit');
        }));

        it('should attach an eventstream to the controller scope', function () {
          expect($scope.vm.eventstream._id).toBe(mockEventstream._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/eventstream/client/views/admin/form-eventstream.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
