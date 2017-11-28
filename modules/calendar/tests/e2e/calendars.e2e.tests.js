'use strict';

describe('Calendars E2E Tests:', function () {
  describe('Test calendars page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/calendars');
      expect(element.all(by.repeater('calendar in calendars')).count()).toEqual(0);
    });
  });
});
