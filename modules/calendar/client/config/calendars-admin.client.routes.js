(function () {
  'use strict';

  angular
    .module('calendars.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.calendars', {
        abstract: true,
        url: '/calendars',
        template: '<ui-view/>'
      })
      .state('admin.calendars.list', {
        url: '',
        templateUrl: '/modules/calendar/client/views/admin/list-calendars.client.view.html',
        controller: 'CalendarsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.calendars.create', {
        url: '/create',
        templateUrl: '/modules/calendar/client/views/admin/form-calendar.client.view.html',
        controller: 'CalendarsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          calendarResolve: newCalendar
        }
      })
      .state('admin.calendars.edit', {
        url: '/:calendarId/edit',
        templateUrl: '/modules/calendar/client/views/admin/form-calendar.client.view.html',
        controller: 'CalendarsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ calendarResolve.title }}'
        },
        resolve: {
          calendarResolve: getCalendar
        }
      });
  }

  getCalendar.$inject = ['$stateParams', 'CalendarsService'];

  function getCalendar($stateParams, CalendarsService) {
    return CalendarsService.get({
      calendarId: $stateParams.calendarId
    }).$promise;
  }

  newCalendar.$inject = ['CalendarsService'];

  function newCalendar(CalendarsService) {
    return new CalendarsService();
  }
}());
