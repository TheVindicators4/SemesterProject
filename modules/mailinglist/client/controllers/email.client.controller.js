(function () {
  'use strict';

  angular
    .module('email')
    .controller('EmailController', EmailController);

  EmailController.$inject = ['$scope', 'emailResolve', 'Authentication'];

  function EmailController($scope, email, Authentication) {
    var vm = this;

    vm.email = email;
    vm.authentication = Authentication;

  }
}());
