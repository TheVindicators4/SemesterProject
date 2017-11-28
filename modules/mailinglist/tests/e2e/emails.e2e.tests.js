'use strict';

describe('Emails E2E Tests:', function () {
  describe('Test emails page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/emails');
      expect(element.all(by.repeater('email in emails')).count()).toEqual(0);
    });
  });
});
