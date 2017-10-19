'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Blogposts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/blogposts',
      permissions: '*'
    }, {
      resources: '/api/blogposts/:blogpostId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/blogposts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/blogposts/:blogpostId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/blogposts',
      permissions: ['get']
    }, {
      resources: '/api/blogposts/:blogpostId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Blogposts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Blogpost is being processed and the current user created it then allow any manipulation
  if (req.blogpost && req.user && req.blogpost.user && req.blogpost.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
