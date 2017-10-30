(function () {
  'use strict';

  describe('Reviews Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReviewsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReviewsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReviewsService = _ReviewsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.reviews');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/reviews');
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
          liststate = $state.get('admin.reviews.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/reviews/client/views/admin/list-reviews.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReviewsAdminController,
          mockReview;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.reviews.create');
          $templateCache.put('/modules/reviews/client/views/admin/form-review.client.view.html', '');

          // Create mock review
          mockReview = new ReviewsService();

          // Initialize Controller
          ReviewsAdminController = $controller('ReviewsAdminController as vm', {
            $scope: $scope,
            reviewResolve: mockReview
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.reviewResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/reviews/create');
        }));

        it('should attach an review to the controller scope', function () {
          expect($scope.vm.review._id).toBe(mockReview._id);
          expect($scope.vm.review._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/reviews/client/views/admin/form-review.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReviewsAdminController,
          mockReview;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.reviews.edit');
          $templateCache.put('/modules/reviews/client/views/admin/form-review.client.view.html', '');

          // Create mock review
          mockReview = new ReviewsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Review about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ReviewsAdminController = $controller('ReviewsAdminController as vm', {
            $scope: $scope,
            reviewResolve: mockReview
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:reviewId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.reviewResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            reviewId: 1
          })).toEqual('/admin/reviews/1/edit');
        }));

        it('should attach an review to the controller scope', function () {
          expect($scope.vm.review._id).toBe(mockReview._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/reviews/client/views/admin/form-review.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
