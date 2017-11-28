(function () {
  'use strict';

  angular
    .module('calendars.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('calendars', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('calendars.list', {
        url: '/contact',
        templateUrl: '/modules/calendar/client/views/calendar.client.view.html',
        controller: 'CalendarsListController',
        controllerAs: 'vm'
      })
      .state('calendars.view', {
        url: '/:calendarId',
        templateUrl: '/modules/calendar/client/views/view-calendar.client.view.html',
        controller: 'CalendarsController',
        controllerAs: 'vm',
        resolve: {
          calendarResolve: getCalendar
        },
        data: {
          pageTitle: '{{ calendarResolve.title }}'
        }
      });
  }

  getCalendar.$inject = ['$stateParams', 'CalendarsService'];

  function getCalendar($stateParams, CalendarsService) {
    return CalendarsService.get({
      calendarId: $stateParams.calendarId
    }).$promise;
  }
}());
