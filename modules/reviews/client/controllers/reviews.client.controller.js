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

  }
}());
