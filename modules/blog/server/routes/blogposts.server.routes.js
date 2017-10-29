'use strict';

/**
 * Module dependencies
 */
var blogpostsPolicy = require('../policies/blogposts.server.policy'),
  blogposts = require('../controllers/blogposts.server.controller');

module.exports = function (app) {
  // Blogposts collection routes
  app.route('/api/blogposts').all(blogpostsPolicy.isAllowed)
    .get(blogposts.list)
    .post(blogposts.create);

  // Single blogpost routes
  app.route('/api/blogposts/:blogpostId').all(blogpostsPolicy.isAllowed)
    .get(blogposts.read)
    .put(blogposts.update)
    .delete(blogposts.delete);

  // Finish by binding the blogpost middleware
  app.param('blogpostId', blogposts.blogpostByID);
};
