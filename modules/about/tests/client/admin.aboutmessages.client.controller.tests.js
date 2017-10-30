(function () {
  'use strict';

  describe('Aboutmessages Admin Controller Tests', function () {
    // Initialize global variables
    var AboutmessagesAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AboutmessagesService,
      mockAboutmessage,
      Notification;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AboutmessagesService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AboutmessagesService = _AboutmessagesService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock aboutmessage
      mockAboutmessage = new AboutmessagesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Aboutmessage about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Aboutmessages controller.
      AboutmessagesAdminController = $controller('AboutmessagesAdminController as vm', {
        $scope: $scope,
        aboutmessageResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleAboutmessagePostData;

      beforeEach(function () {
        // Create a sample aboutmessage object
        sampleAboutmessagePostData = new AboutmessagesService({
          title: 'An Aboutmessage about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.aboutmessage = sampleAboutmessagePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (AboutmessagesService) {
        // Set POST response
        $httpBackend.expectPOST('/api/aboutmessages', sampleAboutmessagePostData).respond(mockAboutmessage);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Aboutmessage saved successfully!' });
        // Test URL redirection after the aboutmessage was created
        expect($state.go).toHaveBeenCalledWith('admin.aboutmessages.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/aboutmessages', sampleAboutmessagePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Aboutmessage save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock aboutmessage in $scope
        $scope.vm.aboutmessage = mockAboutmessage;
      });

      it('should update a valid aboutmessage', inject(function (AboutmessagesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/aboutmessages\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Aboutmessage saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.aboutmessages.list');
      }));

      it('should  call Notification.error if error', inject(function (AboutmessagesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/aboutmessages\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Aboutmessage save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup aboutmessages
        $scope.vm.aboutmessage = mockAboutmessage;
      });

      it('should delete the aboutmessage and redirect to aboutmessages', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/aboutmessages\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Aboutmessage deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.aboutmessages.list');
      });

      it('should should not delete the aboutmessage and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
