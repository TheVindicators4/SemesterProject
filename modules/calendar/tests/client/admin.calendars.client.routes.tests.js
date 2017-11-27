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
          mainstate = $state.get('admin.calendars');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/calendars');
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
          liststate = $state.get('admin.calendars.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/calendar/client/views/admin/list-calendars.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CalendarsAdminController,
          mockCalendar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.calendars.create');
          $templateCache.put('/modules/calendar/client/views/admin/form-calendar.client.view.html', '');

          // Create mock calendar
          mockCalendar = new CalendarsService();

          // Initialize Controller
          CalendarsAdminController = $controller('CalendarsAdminController as vm', {
            $scope: $scope,
            calendarResolve: mockCalendar
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.calendarResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/calendars/create');
        }));

        it('should attach an calendar to the controller scope', function () {
          expect($scope.vm.calendar._id).toBe(mockCalendar._id);
          expect($scope.vm.calendar._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/calendar/client/views/admin/form-calendar.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CalendarsAdminController,
          mockCalendar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.calendars.edit');
          $templateCache.put('/modules/calendar/client/views/admin/form-calendar.client.view.html', '');

          // Create mock calendar
          mockCalendar = new CalendarsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Calendar about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CalendarsAdminController = $controller('CalendarsAdminController as vm', {
            $scope: $scope,
            calendarResolve: mockCalendar
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:calendarId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.calendarResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            calendarId: 1
          })).toEqual('/admin/calendars/1/edit');
        }));

        it('should attach an calendar to the controller scope', function () {
          expect($scope.vm.calendar._id).toBe(mockCalendar._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/calendar/client/views/admin/form-calendar.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
