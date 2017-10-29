'use strict';

describe('AboutMessages E2E Tests:', function () {
  describe('Test aboutMessages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/aboutMessages');
      expect(element.all(by.repeater('aboutMessage in aboutMessages')).count()).toEqual(0);
    });
  });
});
