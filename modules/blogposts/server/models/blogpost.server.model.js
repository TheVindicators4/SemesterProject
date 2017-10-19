'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Blogpost Schema
 */
var BlogpostSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Blogpost name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Blogpost', BlogpostSchema);
