'use strict';

describe('Aboutmessages E2E Tests:', function () {
  describe('Test aboutmessages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/aboutmessages');
      expect(element.all(by.repeater('aboutmessage in aboutmessages')).count()).toEqual(0);
    });
  });
});
