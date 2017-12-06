'use strict';

/**
 * Module dependencies
 */
var contactsPolicy = require('../policies/contacts.server.policy'),
  contacts = require('../controllers/contacts.server.controller');

module.exports = function (app) {
  // Contacts collection routes
  app.route('/api/contacts').all(contactsPolicy.isAllowed)
    .get(contacts.list)
    .post(contacts.create);

  // Single contact routes
  app.route('/api/contacts/:contactId').all(contactsPolicy.isAllowed)
    .get(contacts.read)
    .put(contacts.update)
    .delete(contacts.delete);

  // Finish by binding the contact middleware
  app.param('contactId', contacts.contactByID);
};
