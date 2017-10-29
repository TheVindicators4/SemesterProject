'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  AboutMessage = mongoose.model('AboutMessage'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an aboutMessage
 */
exports.create = function (req, res) {
  var aboutMessage = new AboutMessage(req.body);
  aboutMessage.user = req.user;

  aboutMessage.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutMessage);
    }
  });
};

/**
 * Show the current aboutMessage
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var aboutMessage = req.aboutMessage ? req.aboutMessage.toJSON() : {};

  // Add a custom field to the AboutMessage, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the AboutMessage model.
  aboutMessage.isCurrentUserOwner = !!(req.user && aboutMessage.user && aboutMessage.user._id.toString() === req.user._id.toString());

  res.json(aboutMessage);
};

/**
 * Update an aboutMessage
 */
exports.update = function (req, res) {
  var aboutMessage = req.aboutMessage;

  aboutMessage.title = req.body.title;
  aboutMessage.content = req.body.content;

  aboutMessage.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutMessage);
    }
  });
};

/**
 * Delete an aboutMessage
 */
exports.delete = function (req, res) {
  var aboutMessage = req.aboutMessage;

  aboutMessage.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutMessage);
    }
  });
};

/**
 * List of AboutMessages
 */
exports.list = function (req, res) {
  AboutMessage.find().sort('-created').populate('user', 'displayName').exec(function (err, aboutMessages) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(aboutMessages);
    }
  });
};

/**
 * AboutMessage middleware
 */
exports.aboutMessageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'AboutMessage is invalid'
    });
  }

  AboutMessage.findById(id).populate('user', 'displayName').exec(function (err, aboutMessage) {
    if (err) {
      return next(err);
    } else if (!aboutMessage) {
      return res.status(404).send({
        message: 'No aboutMessage with that identifier has been found'
      });
    }
    req.aboutMessage = aboutMessage;
    next();
  });
};
