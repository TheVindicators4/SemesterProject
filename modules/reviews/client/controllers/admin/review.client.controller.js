(function () {
  'use strict';

  angular
    .module('reviews.admin')
    .controller('ReviewsAdminController', ReviewsAdminController);

  ReviewsAdminController.$inject = ['$scope', '$state', '$window', 'reviewResolve', 'Authentication', 'Notification'];

  function ReviewsAdminController($scope, $state, $window, review, Authentication, Notification) {
    var vm = this;

    vm.review = review;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Review
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.review.$remove(function () {
          $state.go('admin.reviews.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Review deleted successfully!' });
        });
      }
    }

    // Save Review
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reviewForm');
        return false;
      }

      // Create a new review, or update the current instance
      vm.review.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.reviews.list'); // should we send the User to the list or the updated Review's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Review saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Review save error!' });
      }
    }
  }
}());
