(function () {
  'use strict';

  describe('Blogposts Route Tests', function () {
    // Initialize global variables
    var $scope,
      BlogpostsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BlogpostsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BlogpostsService = _BlogpostsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('blogposts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/blogposts');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BlogpostsController,
          mockBlogpost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('blogposts.view');
          $templateCache.put('modules/blogposts/client/views/view-blogpost.client.view.html', '');

          // create mock Blogpost
          mockBlogpost = new BlogpostsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Blogpost Name'
          });

          // Initialize Controller
          BlogpostsController = $controller('BlogpostsController as vm', {
            $scope: $scope,
            blogpostResolve: mockBlogpost
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:blogpostId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.blogpostResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            blogpostId: 1
          })).toEqual('/blogposts/1');
        }));

        it('should attach an Blogpost to the controller scope', function () {
          expect($scope.vm.blogpost._id).toBe(mockBlogpost._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/blogposts/client/views/view-blogpost.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BlogpostsController,
          mockBlogpost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('blogposts.create');
          $templateCache.put('modules/blogposts/client/views/form-blogpost.client.view.html', '');

          // create mock Blogpost
          mockBlogpost = new BlogpostsService();

          // Initialize Controller
          BlogpostsController = $controller('BlogpostsController as vm', {
            $scope: $scope,
            blogpostResolve: mockBlogpost
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.blogpostResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/blogposts/create');
        }));

        it('should attach an Blogpost to the controller scope', function () {
          expect($scope.vm.blogpost._id).toBe(mockBlogpost._id);
          expect($scope.vm.blogpost._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/blogposts/client/views/form-blogpost.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BlogpostsController,
          mockBlogpost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('blogposts.edit');
          $templateCache.put('modules/blogposts/client/views/form-blogpost.client.view.html', '');

          // create mock Blogpost
          mockBlogpost = new BlogpostsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Blogpost Name'
          });

          // Initialize Controller
          BlogpostsController = $controller('BlogpostsController as vm', {
            $scope: $scope,
            blogpostResolve: mockBlogpost
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:blogpostId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.blogpostResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            blogpostId: 1
          })).toEqual('/blogposts/1/edit');
        }));

        it('should attach an Blogpost to the controller scope', function () {
          expect($scope.vm.blogpost._id).toBe(mockBlogpost._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/blogposts/client/views/form-blogpost.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
