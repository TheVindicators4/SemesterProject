'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Calendar = mongoose.model('Calendar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an calendar
 */
exports.create = function (req, res) {
  var calendar = new Calendar(req.body);
  calendar.user = req.user;

  calendar.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(calendar);
    }
  });
};

/**
 * Show the current calendar
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var calendar = req.calendar ? req.calendar.toJSON() : {};

  // Add a custom field to the Calendar, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Calendar model.
  calendar.isCurrentUserOwner = !!(req.user && calendar.user && calendar.user._id.toString() === req.user._id.toString());

  res.json(calendar);
};

/**
 * Update an calendar
 */
exports.update = function (req, res) {
  var calendar = req.calendar;

  calendar.title = req.body.title;
  calendar.content = req.body.content;

  calendar.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(calendar);
    }
  });
};

/**
 * Delete an calendar
 */
exports.delete = function (req, res) {
  var calendar = req.calendar;

  calendar.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(calendar);
    }
  });
};

/**
 * List of Calendars
 */
exports.list = function (req, res) {
  Calendar.find().sort('-created').populate('user', 'displayName').exec(function (err, calendars) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(calendars);
    }
  });
};

/**
 * Calendar middleware
 */
exports.calendarByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Calendar is invalid'
    });
  }

  Calendar.findById(id).populate('user', 'displayName').exec(function (err, calendar) {
    if (err) {
      return next(err);
    } else if (!calendar) {
      return res.status(404).send({
        message: 'No calendar with that identifier has been found'
      });
    }
    req.calendar = calendar;
    next();
  });
};
