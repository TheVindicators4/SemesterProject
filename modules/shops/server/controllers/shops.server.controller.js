'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shop = mongoose.model('Shop'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an shop
 */
exports.create = function (req, res) {
  var shop = new Shop(req.body);
  shop.user = req.user;

  shop.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shop);
    }
  });
};

/**
 * Show the current shop
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var shop = req.shop ? req.shop.toJSON() : {};

  // Add a custom field to the Shop, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Shop model.
  shop.isCurrentUserOwner = !!(req.user && shop.user && shop.user._id.toString() === req.user._id.toString());

  res.json(shop);
};

/**
 * Update an shop
 */
exports.update = function (req, res) {
  var shop = req.shop;

  shop.title = req.body.title;
  shop.content = req.body.content;
  shop.urlImage = req.body.urlImage;
  shop.url = req.body.url;

  shop.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shop);
    }
  });
};

/**
 * Delete an shop
 */
exports.delete = function (req, res) {
  var shop = req.shop;

  shop.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shop);
    }
  });
};

/**
 * List of Shops
 */
exports.list = function (req, res) {
  Shop.find().sort('-created').populate('user', 'displayName').exec(function (err, shops) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(shops);
    }
  });
};

/**
 * Shop middleware
 */
exports.shopByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shop is invalid'
    });
  }

  Shop.findById(id).populate('user', 'displayName').exec(function (err, shop) {
    if (err) {
      return next(err);
    } else if (!shop) {
      return res.status(404).send({
        message: 'No shop with that identifier has been found'
      });
    }
    req.shop = shop;
    next();
  });
};
