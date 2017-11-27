'use strict';

describe('Eventstream E2E Tests:', function () {
  describe('Test eventstream page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventstream');
      expect(element.all(by.repeater('eventstream in eventstream')).count()).toEqual(0);
    });
  });
});
