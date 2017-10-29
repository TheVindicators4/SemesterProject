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
          mainstate = $state.get('aboutMessages');
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
          liststate = $state.get('aboutMessages.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/aboutMessages/client/views/list-aboutMessages.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AboutMessagesController,
          mockAboutMessage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('aboutMessages.view');
          $templateCache.put('/modules/aboutMessages/client/views/view-aboutMessage.client.view.html', '');

          // create mock aboutMessage
          mockAboutMessage = new AboutMessagesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An AboutMessage about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AboutMessagesController = $controller('AboutMessagesController as vm', {
            $scope: $scope,
            aboutMessageResolve: mockAboutMessage
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:aboutMessageId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.aboutMessageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            aboutMessageId: 1
          })).toEqual('/aboutMessages/1');
        }));

        it('should attach an aboutMessage to the controller scope', function () {
          expect($scope.vm.aboutMessage._id).toBe(mockAboutMessage._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/aboutMessages/client/views/view-aboutMessage.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/aboutMessages/client/views/list-aboutMessages.client.view.html', '');

          $state.go('aboutMessages.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('aboutMessages/');
          $rootScope.$digest();

          expect($location.path()).toBe('/aboutMessages');
          expect($state.current.templateUrl).toBe('/modules/aboutMessages/client/views/list-aboutMessages.client.view.html');
        }));
      });
    });
  });
}());
