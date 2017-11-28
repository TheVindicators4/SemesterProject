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
          mainstate = $state.get('eventstream');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/');
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
          liststate = $state.get('eventstream.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/eventstream/client/views/list-eventstream.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EventstreamController,
          mockEventstream;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('eventstream.view');
          $templateCache.put('/modules/eventstream/client/views/view-eventstream.client.view.html', '');

          // create mock eventstream
          mockEventstream = new EventstreamService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Eventstream about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          EventstreamController = $controller('EventstreamController as vm', {
            $scope: $scope,
            eventstreamResolve: mockEventstream
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:eventstreamId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.eventstreamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            eventstreamId: 1
          })).toEqual('//1');
        }));

        it('should attach an eventstream to the controller scope', function () {
          expect($scope.vm.eventstream._id).toBe(mockEventstream._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/eventstream/client/views/view-eventstream.client.view.html');
        });
      });

    /*  describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/eventstream/client/views/list-eventstream.client.view.html', '');

          $state.go('eventstream.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('eventstream/');
          $rootScope.$digest();

          expect($location.path()).toBe('/eventstream');
          expect($state.current.templateUrl).toBe('/modules/eventstream/client/views/list-eventstream.client.view.html');
        }));
      });*/
    });
  });
}());
