
/* Dependencies */
var mongoose = require('mongoose'),
    Events = require('../models/events.server.model.js');

/* Create a listing */
exports.create = function(req, res) {


};

exports.list = function(req, res) {
  Events.find().sort('create_at').exec(function(err, events) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.json(events);
    }
  });
};
