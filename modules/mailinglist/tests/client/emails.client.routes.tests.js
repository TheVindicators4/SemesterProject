(function () {
  'use strict';

  describe('Emails Route Tests', function () {
    // Initialize global variables
    var $scope,
      EmailsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EmailsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EmailsService = _EmailsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('emails');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/emails');
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
          liststate = $state.get('emails.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/mailinglists/client/views/list-emails.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EmailsController,
          mockEmail;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('emails.view');
          $templateCache.put('/modules/mailinglists/client/views/view-email.client.view.html', '');

          // create mock email
          mockEmail = new EmailsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Email about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          EmailsController = $controller('EmailsController as vm', {
            $scope: $scope,
            emailResolve: mockEmail
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:emailId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.emailResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            emailId: 1
          })).toEqual('/emails/1');
        }));

        it('should attach an email to the controller scope', function () {
          expect($scope.vm.email._id).toBe(mockEmail._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/mailinglists/client/views/view-email.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/mailinglists/client/views/list-emails.client.view.html', '');

          $state.go('emails.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('emails/');
          $rootScope.$digest();

          expect($location.path()).toBe('/emails');
          expect($state.current.templateUrl).toBe('/modules/mailinglists/client/views/list-emails.client.view.html');
        }));
      });
    });
  });
}());
