(function () {
  'use strict';

  angular
    .module('aboutmessages')
    .controller('AboutmessagesController', AboutmessagesController);

  AboutmessagesController.$inject = ['$scope', 'aboutmessageResolve', 'Authentication'];

  function AboutmessagesController($scope, aboutmessage, Authentication) {
    var vm = this;

    vm.aboutmessage = aboutmessage;
    vm.authentication = Authentication;

  }
}());
