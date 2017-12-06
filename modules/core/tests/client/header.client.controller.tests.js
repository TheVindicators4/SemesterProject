'use strict';

(function () {
  describe('HeaderController', function () {
    // Initialize global variables
    var scope,
      HeaderController,
      $state,
      Authentication;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function ($controller, $rootScope, _$state_, _Authentication_) {
      scope = $rootScope.$new();
      $state = _$state_;
      Authentication = _Authentication_;

      HeaderController = $controller('HeaderController as vm', {
        $scope: scope
      });
    }));

    describe('when view state changes', function () {
      beforeEach(function () {
        scope.vm.isCollapsed = true;
        scope.$broadcast('$stateChangeSuccess');
      });

      it('should set isCollapsed to false', function () {
        expect(scope.vm.isCollapsed).toBeFalsy();
      });
    });
  });
}());
