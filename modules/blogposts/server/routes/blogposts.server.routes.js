'use strict';

/**
 * Module dependencies
 */
var blogpostsPolicy = require('../policies/blogposts.server.policy'),
  blogposts = require('../controllers/blogposts.server.controller');

module.exports = function(app) {
  // Blogposts Routes
  app.route('/api/blogposts').all(blogpostsPolicy.isAllowed)
    .get(blogposts.list)
    .post(blogposts.create);

  app.route('/api/blogposts/:blogpostId').all(blogpostsPolicy.isAllowed)
    .get(blogposts.read)
    .put(blogposts.update)
    .delete(blogposts.delete);

  // Finish by binding the Blogpost middleware
  app.param('blogpostId', blogposts.blogpostByID);
};
