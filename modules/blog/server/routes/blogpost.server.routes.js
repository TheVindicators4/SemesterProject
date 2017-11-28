'use strict';

/**
 * Module dependencies
 */
var blogpostPolicy = require('../policies/blogpost.server.policy'),
  blogpost = require('../controllers/blogpost.server.controller');

module.exports = function (app) {
  // blogposts collection routes
  app.route('/api/blogpost').all(blogpostPolicy.isAllowed)
    .get(blogpost.list)
    .post(blogpost.create);

  // Single blogpost routes
  app.route('/api/blogpost/:blogpostId').all(blogpostPolicy.isAllowed)
    .get(blogpost.read)
    .put(blogpost.update)
    .delete(blogpost.delete);

  // Finish by binding the blogpost middleware
  app.param('blogpostId', blogpost.blogpostByID);
};
