'use strict';

describe('Blogposts E2E Tests:', function () {
  describe('Test blogposts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/blogposts');
      expect(element.all(by.repeater('blogpost in blogposts')).count()).toEqual(0);
    });
  });
});
