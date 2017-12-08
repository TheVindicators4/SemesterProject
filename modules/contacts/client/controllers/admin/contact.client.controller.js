(function () {
  'use strict';

  angular
    .module('contacts.admin')
    .controller('ContactsAdminController', ContactsAdminController);

  ContactsAdminController.$inject = ['$scope', '$state', '$window', 'contactResolve', 'Authentication', 'Notification'];

  function ContactsAdminController($scope, $state, $window, contact, Authentication, Notification) {
    var vm = this;

    vm.contact = contact;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contact
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contact.$remove(function () {
          $state.go('admin.contacts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Contact deleted successfully!' });
        });
      }
    }

    // Save Contact
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactForm');
        return false;
      }

      // Create a new contact, or update the current instance
	  contact.approve = true; 
      vm.contact.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.contacts.list'); // should we send the User to the list or the updated Contact's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Contact saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Contact save error!' });
      }
    }
  }
}());
