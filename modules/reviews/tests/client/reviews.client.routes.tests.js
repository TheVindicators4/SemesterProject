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
          mainstate = $state.get('reviews');
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
          liststate = $state.get('reviews.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/reviews/client/views/list-reviews.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ReviewsController,
          mockReview;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('reviews.view');
          $templateCache.put('/modules/reviews/client/views/view-review.client.view.html', '');

          // create mock review
          mockReview = new ReviewsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Review about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ReviewsController = $controller('ReviewsController as vm', {
            $scope: $scope,
            reviewResolve: mockReview
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:reviewId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.reviewResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            reviewId: 1
          })).toEqual('/reviews/1');
        }));

        it('should attach an review to the controller scope', function () {
          expect($scope.vm.review._id).toBe(mockReview._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/reviews/client/views/view-review.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/reviews/client/views/list-reviews.client.view.html', '');

          $state.go('reviews.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('reviews/');
          $rootScope.$digest();

          expect($location.path()).toBe('/reviews');
          expect($state.current.templateUrl).toBe('/modules/reviews/client/views/list-reviews.client.view.html');
        }));
      });
    });
  });
}());
