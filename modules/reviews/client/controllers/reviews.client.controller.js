(function () {
  'use strict';

  angular
    .module('reviews')
    .controller('ReviewsController', ReviewsController);

  ReviewsController.$inject = ['$scope', 'reviewResolve', 'Authentication'];

  function ReviewsController($scope, review, Authentication) {
    var vm = this;

    vm.review = review;
    vm.authentication = Authentication;
  //  vm.form = {};
    //vm.save = save;

    // Save Review
  /*  function save(isValid) {
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
    }*/




  }
}());
