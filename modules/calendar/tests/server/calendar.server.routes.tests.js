'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Calendar = mongoose.model('Calendar'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  calendar;

/**
 * Calendar routes tests
 */
describe('Calendar CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new calendar
    user.save()
      .then(function () {
        calendar = {
          title: 'Calendar Title',
          content: 'Calendar Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an calendar if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/calendars')
          .send(calendar)
          .expect(403)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Call the assertion callback
            done(calendarSaveErr);
          });

      });
  });

  it('should not be able to save an calendar if not logged in', function (done) {
    agent.post('/api/calendars')
      .send(calendar)
      .expect(403)
      .end(function (calendarSaveErr, calendarSaveRes) {
        // Call the assertion callback
        done(calendarSaveErr);
      });
  });

  it('should not be able to update an calendar if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/calendars')
          .send(calendar)
          .expect(403)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Call the assertion callback
            done(calendarSaveErr);
          });
      });
  });

  it('should be able to get a list of calendars if not signed in', function (done) {
    // Create new calendar model instance
    var calendarObj = new Calendar(calendar);

    // Save the calendar
    calendarObj.save(function () {
      // Request calendars
      agent.get('/api/calendars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single calendar if not signed in', function (done) {
    // Create new calendar model instance
    var calendarObj = new Calendar(calendar);

    // Save the calendar
    calendarObj.save(function () {
      agent.get('/api/calendars/' + calendarObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', calendar.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single calendar with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/calendars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Calendar is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single calendar which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent calendar
    agent.get('/api/calendars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No calendar with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an calendar if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/calendars')
          .send(calendar)
          .expect(403)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Call the assertion callback
            done(calendarSaveErr);
          });
      });
  });

  it('should not be able to delete an calendar if not signed in', function (done) {
    // Set calendar user
    calendar.user = user;

    // Create new calendar model instance
    var calendarObj = new Calendar(calendar);

    // Save the calendar
    calendarObj.save(function () {
      // Try deleting calendar
      agent.delete('/api/calendars/' + calendarObj._id)
        .expect(403)
        .end(function (calendarDeleteErr, calendarDeleteRes) {
          // Set message assertion
          (calendarDeleteRes.body.message).should.match('User is not authorized');

          // Handle calendar error error
          done(calendarDeleteErr);
        });

    });
  });

  it('should be able to get a single calendar that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new calendar
          agent.post('/api/calendars')
            .send(calendar)
            .expect(200)
            .end(function (calendarSaveErr, calendarSaveRes) {
              // Handle calendar save error
              if (calendarSaveErr) {
                return done(calendarSaveErr);
              }

              // Set assertions on new calendar
              (calendarSaveRes.body.title).should.equal(calendar.title);
              should.exist(calendarSaveRes.body.user);
              should.equal(calendarSaveRes.body.user._id, orphanId);

              // force the calendar to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the calendar
                    agent.get('/api/calendars/' + calendarSaveRes.body._id)
                      .expect(200)
                      .end(function (calendarInfoErr, calendarInfoRes) {
                        // Handle calendar error
                        if (calendarInfoErr) {
                          return done(calendarInfoErr);
                        }

                        // Set assertions
                        (calendarInfoRes.body._id).should.equal(calendarSaveRes.body._id);
                        (calendarInfoRes.body.title).should.equal(calendar.title);
                        should.equal(calendarInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single calendar if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new calendar model instance
    var calendarObj = new Calendar(calendar);

    // Save the calendar
    calendarObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/calendars/' + calendarObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', calendar.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single calendar, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'calendarowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Calendar
    var _calendarOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _calendarOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Calendar
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new calendar
          agent.post('/api/calendars')
            .send(calendar)
            .expect(200)
            .end(function (calendarSaveErr, calendarSaveRes) {
              // Handle calendar save error
              if (calendarSaveErr) {
                return done(calendarSaveErr);
              }

              // Set assertions on new calendar
              (calendarSaveRes.body.title).should.equal(calendar.title);
              should.exist(calendarSaveRes.body.user);
              should.equal(calendarSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the calendar
                  agent.get('/api/calendars/' + calendarSaveRes.body._id)
                    .expect(200)
                    .end(function (calendarInfoErr, calendarInfoRes) {
                      // Handle calendar error
                      if (calendarInfoErr) {
                        return done(calendarInfoErr);
                      }

                      // Set assertions
                      (calendarInfoRes.body._id).should.equal(calendarSaveRes.body._id);
                      (calendarInfoRes.body.title).should.equal(calendar.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (calendarInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Calendar.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
