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
describe('Calendar Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an calendar if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(200)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Handle calendar save error
            if (calendarSaveErr) {
              return done(calendarSaveErr);
            }

            // Get a list of calendars
            agent.get('/api/calendars')
              .end(function (calendarsGetErr, calendarsGetRes) {
                // Handle calendar save error
                if (calendarsGetErr) {
                  return done(calendarsGetErr);
                }

                // Get calendars list
                var calendars = calendarsGetRes.body;

                // Set assertions
                (calendars[0].user._id).should.equal(userId);
                (calendars[0].title).should.match('Calendar Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an calendar if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(200)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Handle calendar save error
            if (calendarSaveErr) {
              return done(calendarSaveErr);
            }

            // Update calendar title
            calendar.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing calendar
            agent.put('/api/calendars/' + calendarSaveRes.body._id)
              .send(calendar)
              .expect(200)
              .end(function (calendarUpdateErr, calendarUpdateRes) {
                // Handle calendar update error
                if (calendarUpdateErr) {
                  return done(calendarUpdateErr);
                }

                // Set assertions
                (calendarUpdateRes.body._id).should.equal(calendarSaveRes.body._id);
                (calendarUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an calendar if no title is provided', function (done) {
    // Invalidate title field
    calendar.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(422)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Set message assertion
            (calendarSaveRes.body.message).should.match('Title cannot be blank');

            // Handle calendar save error
            done(calendarSaveErr);
          });
      });
  });

  it('should be able to delete an calendar if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(200)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Handle calendar save error
            if (calendarSaveErr) {
              return done(calendarSaveErr);
            }

            // Delete an existing calendar
            agent.delete('/api/calendars/' + calendarSaveRes.body._id)
              .send(calendar)
              .expect(200)
              .end(function (calendarDeleteErr, calendarDeleteRes) {
                // Handle calendar error error
                if (calendarDeleteErr) {
                  return done(calendarDeleteErr);
                }

                // Set assertions
                (calendarDeleteRes.body._id).should.equal(calendarSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single calendar if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new calendar model instance
    calendar.user = user;
    var calendarObj = new Calendar(calendar);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new calendar
        agent.post('/api/calendars')
          .send(calendar)
          .expect(200)
          .end(function (calendarSaveErr, calendarSaveRes) {
            // Handle calendar save error
            if (calendarSaveErr) {
              return done(calendarSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (calendarInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
