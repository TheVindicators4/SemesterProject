'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Eventstream = mongoose.model('Eventstream'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  eventstream;

/**
 * Eventstream routes tests
 */
describe('Eventstream Admin CRUD tests', function () {
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

    // Save a user to the test db and create new eventstream
    user.save()
      .then(function () {
        eventstream = {
          title: 'Eventstream Title',
          content: 'Eventstream Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an eventstream if logged in', function (done) {
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

        // Save a new eventstream
        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(200)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Handle eventstream save error
            if (eventstreamSaveErr) {
              return done(eventstreamSaveErr);
            }

            // Get a list of eventstream
            agent.get('/api/eventstream')
              .end(function (eventstreamGetErr, eventstreamGetRes) {
                // Handle eventstream save error
                if (eventstreamGetErr) {
                  return done(eventstreamGetErr);
                }

                // Get eventstream list
                var eventstream = eventstreamGetRes.body;

                // Set assertions
                (eventstream[0].user._id).should.equal(userId);
                (eventstream[0].title).should.match('Eventstream Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an eventstream if signed in', function (done) {
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

        // Save a new eventstream
        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(200)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Handle eventstream save error
            if (eventstreamSaveErr) {
              return done(eventstreamSaveErr);
            }

            // Update eventstream title
            eventstream.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing eventstream
            agent.put('/api/eventstream/' + eventstreamSaveRes.body._id)
              .send(eventstream)
              .expect(200)
              .end(function (eventstreamUpdateErr, eventstreamUpdateRes) {
                // Handle eventstream update error
                if (eventstreamUpdateErr) {
                  return done(eventstreamUpdateErr);
                }

                // Set assertions
                (eventstreamUpdateRes.body._id).should.equal(eventstreamSaveRes.body._id);
                (eventstreamUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an eventstream if no title is provided', function (done) {
    // Invalidate title field
    eventstream.title = '';

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

        // Save a new eventstream
        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(422)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Set message assertion
            (eventstreamSaveRes.body.message).should.match('Title cannot be blank');

            // Handle eventstream save error
            done(eventstreamSaveErr);
          });
      });
  });

  it('should be able to delete an eventstream if signed in', function (done) {
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

        // Save a new eventstream
        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(200)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Handle eventstream save error
            if (eventstreamSaveErr) {
              return done(eventstreamSaveErr);
            }

            // Delete an existing eventstream
            agent.delete('/api/eventstream/' + eventstreamSaveRes.body._id)
              .send(eventstream)
              .expect(200)
              .end(function (eventstreamDeleteErr, eventstreamDeleteRes) {
                // Handle eventstream error error
                if (eventstreamDeleteErr) {
                  return done(eventstreamDeleteErr);
                }

                // Set assertions
                (eventstreamDeleteRes.body._id).should.equal(eventstreamSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single eventstream if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new eventstream model instance
    eventstream.user = user;
    var eventstreamObj = new Eventstream(eventstream);

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

        // Save a new eventstream
        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(200)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Handle eventstream save error
            if (eventstreamSaveErr) {
              return done(eventstreamSaveErr);
            }

            // Get the eventstream
            agent.get('/api/eventstream/' + eventstreamSaveRes.body._id)
              .expect(200)
              .end(function (eventstreamInfoErr, eventstreamInfoRes) {
                // Handle eventstream error
                if (eventstreamInfoErr) {
                  return done(eventstreamInfoErr);
                }

                // Set assertions
                (eventstreamInfoRes.body._id).should.equal(eventstreamSaveRes.body._id);
                (eventstreamInfoRes.body.title).should.equal(eventstream.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (eventstreamInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Eventstream.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
