(function () {
  'use strict';

  angular
    .module('reviews')
    .controller('ReviewsController', ReviewsController);

  ReviewsController.$inject = ['$scope', '$state', '$window', 'reviewResolve', 'Authentication', 'Notification'];

  function ReviewsController($scope, $state, $window, review, Authentication, Notification) {
    var vm = this;

    vm.review = review;
    vm.authentication = Authentication;
    vm.form = {};
    vm.save = save;




    // Save Review
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reviewForm');
        return false;
      }

      // Create a new review, or update the current instance
          //vm.review.user = 'guest';
      vm.review.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('reviews.list'); // should we send the User to the list or the updated Review's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Review saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Review save error!' });
      }
    }




  }
}());
