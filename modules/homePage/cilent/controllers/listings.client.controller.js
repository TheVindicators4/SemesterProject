angular.module('events').controller('EventsController', ['$scope', '$location', '$stateParams', '$state', 'Events',
  function($scope, $location, $stateParams, $state, Listings){
        $scope.listEvents = function() {
          //  Events.list();
          console.log("Reached");
        }


  }
]);
