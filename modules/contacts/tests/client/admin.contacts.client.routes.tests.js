(function () {
  'use strict';

  describe('Contacts Route Tests', function () {
    // Initialize global variables
    var $scope,
      ContactsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ContactsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ContactsService = _ContactsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.contacts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contacts');
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
          liststate = $state.get('admin.contacts.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/contacts/client/views/admin/list-contacts.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ContactsAdminController,
          mockContact;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.contacts.create');
          $templateCache.put('/modules/contacts/client/views/admin/form-contact.client.view.html', '');

          // Create mock contact
          mockContact = new ContactsService();

          // Initialize Controller
          ContactsAdminController = $controller('ContactsAdminController as vm', {
            $scope: $scope,
            contactResolve: mockContact
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.contactResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/contacts/create');
        }));

        it('should attach an contact to the controller scope', function () {
          expect($scope.vm.contact._id).toBe(mockContact._id);
          expect($scope.vm.contact._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/contacts/client/views/admin/form-contact.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ContactsAdminController,
          mockContact;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.contacts.edit');
          $templateCache.put('/modules/contacts/client/views/admin/form-contact.client.view.html', '');

          // Create mock contact
          mockContact = new ContactsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Contact about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ContactsAdminController = $controller('ContactsAdminController as vm', {
            $scope: $scope,
            contactResolve: mockContact
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:contactId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.contactResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            contactId: 1
          })).toEqual('/admin/contacts/1/edit');
        }));

        it('should attach an contact to the controller scope', function () {
          expect($scope.vm.contact._id).toBe(mockContact._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/contacts/client/views/admin/form-contact.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
