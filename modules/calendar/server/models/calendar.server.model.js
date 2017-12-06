'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
path = require('path'),
config = require(path.resolve('./config/config')),
chalk = require('chalk');

/**
* Calendar Schema
*/
var CalendarSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: 'Anonymous',
    trim: true,
  },
  email: {
    type: String,
    default: 'no email given',
    trim: true
  },
  phone: {
    type: String,
    default: 'no phone given',
    trim: true
  },
  message: {
    type: String,
    default: 'no message',
    required: true,
    trim: true
  },
  booking: {
    type: Boolean,
    default: 'false',
    trim: true,
  },
  info: {
    type: Boolean,
    default: 'false',
    trim: true
  },
  concern: {
    type: Boolean,
    default: 'false',
    trim: true
  },
  other: {
    type: Boolean,
    default: 'false',
    trim: true,
  },
  monday: {
    type: Boolean,
    default: 'false',
    trim: true,
  },
  tuesday: {
    type: Boolean,
    default: 'false',
    trim: true
  },
  wednesday: {
    type: Boolean,
    default: 'false',
    trim: true
  },
  thursday: {
    type: Boolean,
    default: 'false',
    trim: true,
  },
  friday: {
    type: Boolean,
    default: 'false',
    trim: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

CalendarSchema.statics.seed = seed;

mongoose.model('Calendar', CalendarSchema);

/**
* Seeds the User collection with document (Calendar)
* and provided options.
*/
function seed(doc, options) {
  var Calendar = mongoose.model('Calendar');

  return new Promise(function (resolve, reject) {

    skipDocument()
    .then(findAdminUser)
    .then(add)
    .then(function (response) {
      return resolve(response);
    })
    .catch(function (err) {
      return reject(err);
    });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
        .findOne({
          roles: { $in: ['admin'] }
        })
        .exec(function (err, admin) {
          if (err) {
            return reject(err);
          }

          doc.user = admin;

          return resolve();
        });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Calendar
        .findOne({
          title: doc.title
        })
        .exec(function (err, existing) {
          if (err) {
            return reject(err);
          }

          if (!existing) {
            return resolve(false);
          }

          if (existing && !options.overwrite) {
            return resolve(true);
          }

          // Remove Calendar (overwrite)

          existing.remove(function (err) {
            if (err) {
              return reject(err);
            }

            return resolve(false);
          });
        });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Calendar\t' + doc.title + ' skipped')
          });
        }

        var calendar = new Calendar(doc);

        calendar.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Request submitted!'
          });
        });
      });
    }
  });
}
