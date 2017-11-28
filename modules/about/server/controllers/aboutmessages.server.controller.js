'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Aboutmessage = mongoose.model('Aboutmessage'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an aboutmessage
 */
exports.create = function (req, res) {
  var aboutmessage = new Aboutmessage(req.body);
  aboutmessage.user = req.user;

  aboutmessage.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutmessage);
    }
  });
};

/**
 * Show the current aboutmessage
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var aboutmessage = req.aboutmessage ? req.aboutmessage.toJSON() : {};

  // Add a custom field to the Aboutmessage, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Aboutmessage model.
  aboutmessage.isCurrentUserOwner = !!(req.user && aboutmessage.user && aboutmessage.user._id.toString() === req.user._id.toString());

  res.json(aboutmessage);
};

/**
 * Update an aboutmessage
 */
exports.update = function (req, res) {
  var aboutmessage = req.aboutmessage;

  aboutmessage.title = req.body.title;
  aboutmessage.content = req.body.content;

  aboutmessage.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutmessage);
    }
  });
};

/**
 * Delete an aboutmessage
 */
exports.delete = function (req, res) {
  var aboutmessage = req.aboutmessage;

  aboutmessage.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutmessage);
    }
  });
};

/**
 * List of Aboutmessages
 */
exports.list = function (req, res) {
  Aboutmessage.find().sort('-created').populate('user', 'displayName').exec(function (err, aboutmessages) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutmessages);
    }
  });
};

/**
 * Aboutmessage middleware
 */
exports.aboutmessageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Aboutmessage is invalid'
    });
  }

  Aboutmessage.findById(id).populate('user', 'displayName').exec(function (err, aboutmessage) {
    if (err) {
      return next(err);
    } else if (!aboutmessage) {
      return res.status(404).send({
        message: 'No aboutmessage with that identifier has been found'
      });
    }
    req.aboutmessage = aboutmessage;
    next();
  });
};
