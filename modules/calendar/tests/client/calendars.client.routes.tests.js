(function () {
  'use strict';

  describe('Calendars Route Tests', function () {
    // Initialize global variables
    var $scope,
      CalendarsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CalendarsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CalendarsService = _CalendarsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('calendars');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contactme');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      /*describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('calendars.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('/scheduling');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/calendar/client/views/calendars.client.view.html');
        });
      });*/

      describe('View Route', function () {
        var viewstate,
          CalendarsController,
          mockCalendar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('calendars.view');
          $templateCache.put('/modules/calendar/client/views/view-calendar.client.view.html', '');

          // create mock calendar
          mockCalendar = new CalendarsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Calendar about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CalendarsController = $controller('CalendarsController as vm', {
            $scope: $scope,
            calendarResolve: mockCalendar
          });
        }));

      /*  it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:calendarId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.calendarResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            calendarId: 1
          })).toEqual('/calendars/1');
        }));

        it('should attach an calendar to the controller scope', function () {
          expect($scope.vm.calendar._id).toBe(mockCalendar._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/calendar/client/views/view-calendar.client.view.html');
        });*/
      });

    /*  describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/calendar/client/views/list-calendars.client.view.html', '');

          $state.go('calendars.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('calendars/');
          $rootScope.$digest();

          expect($location.path()).toBe('/calendars');
          expect($state.current.templateUrl).toBe('/modules/calendar/client/views/list-calendars.client.view.html');
        }));
      });*/
    });
  });
}());
