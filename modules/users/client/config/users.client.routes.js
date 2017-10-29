(function () {
  'use strict';

  // Setting up route
  angular
  .module('users.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
    .state('authentication', {
      abstract: true,
      url: '/authentication',
      templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
      controller: 'AuthenticationController',
      controllerAs: 'vm'
    })
    .state('authentication.signup', {
      url: '/signup',
      templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
      controller: 'AuthenticationController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Signup'
      }
    })
    .state('authentication.signin', {
      url: '/signin',
      templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
      controller: 'AuthenticationController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Signin'
      }
    })
    .state('password', {
      abstract: true,
      url: '/password',
      template: '<ui-view/>'
    })
    .state('password.forgot', {
      url: '/forgot',
      templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
      controller: 'PasswordController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Password forgot'
      }
    })
    .state('password.reset', {
      abstract: true,
      url: '/reset',
      template: '<ui-view/>'
    })
    .state('password.reset.invalid', {
      url: '/invalid',
      templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
      data: {
        pageTitle: 'Password reset invalid'
      }
    })
    .state('password.reset.success', {
      url: '/success',
      templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
      data: {
        pageTitle: 'Password reset success'
      }
    })
    .state('password.reset.form', {
      url: '/:token',
      templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
      controller: 'PasswordController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Password reset form'
      }
    })
    .state('settings', {
      abstract: true,
      url: '/',
      template: '<ui-view/>'
    })
    .state('settings.admin', {
      url: '/admin/settings',
      templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
      controller: 'SettingsController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Admin Settings'
      }
    })
  });
}
}());
