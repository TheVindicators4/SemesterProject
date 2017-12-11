'use strict';

describe('Contacts E2E Tests:', function () {
  describe('Test contacts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contacts');
      expect(element.all(by.repeater('contact in contacts')).count()).toEqual(0);
    });
  });
});
