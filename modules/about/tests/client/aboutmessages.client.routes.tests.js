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
          mainstate = $state.get('aboutmessages');
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
          liststate = $state.get('aboutmessages.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/about/client/views/list-aboutmessages.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AboutmessagesController,
          mockAboutmessage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('aboutmessages.view');
          $templateCache.put('/modules/about/client/views/view-aboutmessage.client.view.html', '');

          // create mock aboutmessage
          mockAboutmessage = new AboutmessagesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Aboutmessage about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AboutmessagesController = $controller('AboutmessagesController as vm', {
            $scope: $scope,
            aboutmessageResolve: mockAboutmessage
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:aboutmessageId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.aboutmessageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            aboutmessageId: 1
          })).toEqual('/aboutmessages/1');
        }));

        it('should attach an aboutmessage to the controller scope', function () {
          expect($scope.vm.aboutmessage._id).toBe(mockAboutmessage._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/about/client/views/view-aboutmessage.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/about/client/views/list-aboutmessages.client.view.html', '');

          $state.go('aboutmessages.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('aboutmessages/');
          $rootScope.$digest();

          expect($location.path()).toBe('/aboutmessages');
          expect($state.current.templateUrl).toBe('/modules/about/client/views/list-aboutmessages.client.view.html');
        }));
      });
    });
  });
}());
