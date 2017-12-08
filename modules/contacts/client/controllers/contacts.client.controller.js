(function () {
  'use strict';

  angular
    .module('contacts')
    .controller('ContactsController', ContactsController);

  ContactsController.$inject = ['$scope', '$state', '$window', 'contactResolve', 'Authentication', 'Notification'];

  function ContactsController($scope, $state, $window, contact, Authentication, Notification) {
    var vm = this;

    vm.contact = contact;
    vm.authentication = Authentication;
    vm.form = {};
    vm.save = save;




    // Save Contact
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactForm');
        return false;
      }

      // Create a new contact, or update the current instance
          //vm.contact.user = 'guest';
      vm.contact.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('contacts.create'); // should we send the User to the list or the updated Contact's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Contact saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Contact save error!' });
      }
    }




  }
}());
