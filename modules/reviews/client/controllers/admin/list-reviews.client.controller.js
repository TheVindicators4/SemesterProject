(function () {
  'use strict';

  angular
    .module('reviews.admin')
    .controller('ReviewsAdminListController', ReviewsAdminListController);

  ReviewsAdminListController.$inject = ['ReviewsService'];

  function ReviewsAdminListController(ReviewsService) {
    var vm = this;

    vm.reviews = ReviewsService.query();
  }
}());
