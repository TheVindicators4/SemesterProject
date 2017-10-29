(function () {
  'use strict';

  angular
    .module('aboutMessages')
    .controller('AboutMessagesController', AboutMessagesController);

  AboutMessagesController.$inject = ['$scope', 'aboutMessageResolve', 'Authentication'];

  function AboutMessagesController($scope, aboutMessage, Authentication) {
    var vm = this;

    vm.aboutMessage = aboutMessage;
    vm.authentication = Authentication;

  }
}());
