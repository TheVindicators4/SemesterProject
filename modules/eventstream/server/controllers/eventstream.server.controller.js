'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Eventstream = mongoose.model('Eventstream'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an eventstream
 */
exports.create = function (req, res) {
  var eventstream = new Eventstream(req.body);
  eventstream.user = req.user;

  eventstream.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventstream);
    }
  });
};

/**
 * Show the current eventstream
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var eventstream = req.eventstream ? req.eventstream.toJSON() : {};

  // Add a custom field to the Eventstream, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Eventstream model.
  eventstream.isCurrentUserOwner = !!(req.user && eventstream.user && eventstream.user._id.toString() === req.user._id.toString());

  res.json(eventstream);
};

/**
 * Update an eventstream
 */
exports.update = function (req, res) {
  var eventstream = req.eventstream;

  eventstream.title = req.body.title;
  eventstream.content = req.body.content;

  eventstream.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventstream);
    }
  });
};

/**
 * Delete an eventstream
 */
exports.delete = function (req, res) {
  var eventstream = req.eventstream;

  eventstream.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventstream);
    }
  });
};

/**
 * List of Eventstreams
 */
exports.list = function (req, res) {
  Eventstream.find().sort('-created').populate('user', 'displayName').exec(function (err, eventstreams) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventstreams);
    }
  });
};

/**
 * Eventstream middleware
 */
exports.eventstreamByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Eventstream is invalid'
    });
  }

  Eventstream.findById(id).populate('user', 'displayName').exec(function (err, eventstream) {
    if (err) {
      return next(err);
    } else if (!eventstream) {
      return res.status(404).send({
        message: 'No eventstream with that identifier has been found'
      });
    }
    req.eventstream = eventstream;
    next();
  });
};
