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

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('blogposts.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/blogposts/client/views/list-blogposts.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BlogpostsController,
          mockBlogpost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('blogposts.view');
          $templateCache.put('/modules/blogposts/client/views/view-blogpost.client.view.html', '');

          // create mock blogpost
          mockBlogpost = new BlogpostsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Blogpost about MEAN',
            content: 'MEAN rocks!'
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

        it('should attach an blogpost to the controller scope', function () {
          expect($scope.vm.blogpost._id).toBe(mockBlogpost._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/blogposts/client/views/view-blogpost.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/blogposts/client/views/list-blogposts.client.view.html', '');

          $state.go('blogposts.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('blogposts/');
          $rootScope.$digest();

          expect($location.path()).toBe('/blogposts');
          expect($state.current.templateUrl).toBe('/modules/blogposts/client/views/list-blogposts.client.view.html');
        }));
      });
    });
  });
}());
