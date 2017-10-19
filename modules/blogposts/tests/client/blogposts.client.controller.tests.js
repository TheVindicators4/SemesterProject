(function () {
  'use strict';

  describe('Blogposts Controller Tests', function () {
    // Initialize global variables
    var BlogpostsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      BlogpostsService,
      mockBlogpost;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _BlogpostsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      BlogpostsService = _BlogpostsService_;

      // create mock Blogpost
      mockBlogpost = new BlogpostsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Blogpost Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Blogposts controller.
      BlogpostsController = $controller('BlogpostsController as vm', {
        $scope: $scope,
        blogpostResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleBlogpostPostData;

      beforeEach(function () {
        // Create a sample Blogpost object
        sampleBlogpostPostData = new BlogpostsService({
          name: 'Blogpost Name'
        });

        $scope.vm.blogpost = sampleBlogpostPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (BlogpostsService) {
        // Set POST response
        $httpBackend.expectPOST('api/blogposts', sampleBlogpostPostData).respond(mockBlogpost);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Blogpost was created
        expect($state.go).toHaveBeenCalledWith('blogposts.view', {
          blogpostId: mockBlogpost._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/blogposts', sampleBlogpostPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Blogpost in $scope
        $scope.vm.blogpost = mockBlogpost;
      });

      it('should update a valid Blogpost', inject(function (BlogpostsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/blogposts\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('blogposts.view', {
          blogpostId: mockBlogpost._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (BlogpostsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/blogposts\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Blogposts
        $scope.vm.blogpost = mockBlogpost;
      });

      it('should delete the Blogpost and redirect to Blogposts', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/blogposts\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('blogposts.list');
      });

      it('should should not delete the Blogpost and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
