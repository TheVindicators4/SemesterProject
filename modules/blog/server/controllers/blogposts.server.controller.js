'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Blogpost = mongoose.model('Blogpost'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an blogpost
 */
exports.create = function (req, res) {
  var blogpost = new Blogpost(req.body);
  blogpost.user = req.user;

  blogpost.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogpost);
    }
  });
};

/**
 * Show the current blogpost
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var blogpost = req.blogpost ? req.blogpost.toJSON() : {};

  // Add a custom field to the Blogpost, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Blogpost model.
  blogpost.isCurrentUserOwner = !!(req.user && blogpost.user && blogpost.user._id.toString() === req.user._id.toString());

  res.json(blogpost);
};

/**
 * Update an blogpost
 */
exports.update = function (req, res) {
  var blogpost = req.blogpost;

  blogpost.title = req.body.title;
  blogpost.content = req.body.content;

  blogpost.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogpost);
    }
  });
};

/**
 * Delete an blogpost
 */
exports.delete = function (req, res) {
  var blogpost = req.blogpost;

  blogpost.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogpost);
    }
  });
};

/**
 * List of Blogposts
 */
exports.list = function (req, res) {
  Blogpost.find().sort('-created').populate('user', 'displayName').exec(function (err, blogposts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogposts);
    }
  });
};

/**
 * Blogpost middleware
 */
exports.blogpostByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Blogpost is invalid'
    });
  }

  Blogpost.findById(id).populate('user', 'displayName').exec(function (err, blogpost) {
    if (err) {
      return next(err);
    } else if (!blogpost) {
      return res.status(404).send({
        message: 'No blogpost with that identifier has been found'
      });
    }
    req.blogpost = blogpost;
    next();
  });
};
