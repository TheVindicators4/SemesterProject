'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Eventstreams Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/eventstream',
      permissions: '*'
    }, {
      resources: '/api/eventstream/:eventstreamId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/eventstream',
      permissions: ['get']
    }, {
      resources: '/api/eventstream/:eventstreamId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/eventstream',
      permissions: ['get']
    }, {
      resources: '/api/eventstream/:eventstreamId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Eventstreams Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an eventstream is being processed and the current user created it then allow any manipulation
  if (req.eventstream && req.user && req.eventstream.user && req.eventstream.user.id === req.user.id) {
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
