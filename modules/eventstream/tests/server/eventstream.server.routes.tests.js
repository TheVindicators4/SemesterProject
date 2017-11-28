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
describe('Eventstream CRUD tests', function () {

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

  it('should not be able to save an eventstream if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(403)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Call the assertion callback
            done(eventstreamSaveErr);
          });

      });
  });

  it('should not be able to save an eventstream if not logged in', function (done) {
    agent.post('/api/eventstream')
      .send(eventstream)
      .expect(403)
      .end(function (eventstreamSaveErr, eventstreamSaveRes) {
        // Call the assertion callback
        done(eventstreamSaveErr);
      });
  });

  it('should not be able to update an eventstream if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(403)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Call the assertion callback
            done(eventstreamSaveErr);
          });
      });
  });

  it('should be able to get a list of eventstream if not signed in', function (done) {
    // Create new eventstream model instance
    var eventstreamObj = new Eventstream(eventstream);

    // Save the eventstream
    eventstreamObj.save(function () {
      // Request eventstream
      agent.get('/api/eventstream')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single eventstream if not signed in', function (done) {
    // Create new eventstream model instance
    var eventstreamObj = new Eventstream(eventstream);

    // Save the eventstream
    eventstreamObj.save(function () {
      agent.get('/api/eventstream/' + eventstreamObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', eventstream.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single eventstream with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/eventstream/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Eventstream is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single eventstream which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent eventstream
    agent.get('/api/eventstream/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No eventstream with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an eventstream if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/eventstream')
          .send(eventstream)
          .expect(403)
          .end(function (eventstreamSaveErr, eventstreamSaveRes) {
            // Call the assertion callback
            done(eventstreamSaveErr);
          });
      });
  });

  it('should not be able to delete an eventstream if not signed in', function (done) {
    // Set eventstream user
    eventstream.user = user;

    // Create new eventstream model instance
    var eventstreamObj = new Eventstream(eventstream);

    // Save the eventstream
    eventstreamObj.save(function () {
      // Try deleting eventstream
      agent.delete('/api/eventstream/' + eventstreamObj._id)
        .expect(403)
        .end(function (eventstreamDeleteErr, eventstreamDeleteRes) {
          // Set message assertion
          (eventstreamDeleteRes.body.message).should.match('User is not authorized');

          // Handle eventstream error error
          done(eventstreamDeleteErr);
        });

    });
  });

  it('should be able to get a single eventstream that has an orphaned user reference', function (done) {
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

          // Save a new eventstream
          agent.post('/api/eventstream')
            .send(eventstream)
            .expect(200)
            .end(function (eventstreamSaveErr, eventstreamSaveRes) {
              // Handle eventstream save error
              if (eventstreamSaveErr) {
                return done(eventstreamSaveErr);
              }

              // Set assertions on new eventstream
              (eventstreamSaveRes.body.title).should.equal(eventstream.title);
              should.exist(eventstreamSaveRes.body.user);
              should.equal(eventstreamSaveRes.body.user._id, orphanId);

              // force the eventstream to have an orphaned user reference
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
                        should.equal(eventstreamInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single eventstream if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new eventstream model instance
    var eventstreamObj = new Eventstream(eventstream);

    // Save the eventstream
    eventstreamObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/eventstream/' + eventstreamObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', eventstream.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single eventstream, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'eventstreamowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Eventstream
    var _eventstreamOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _eventstreamOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Eventstream
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

          // Save a new eventstream
          agent.post('/api/eventstream')
            .send(eventstream)
            .expect(200)
            .end(function (eventstreamSaveErr, eventstreamSaveRes) {
              // Handle eventstream save error
              if (eventstreamSaveErr) {
                return done(eventstreamSaveErr);
              }

              // Set assertions on new eventstream
              (eventstreamSaveRes.body.title).should.equal(eventstream.title);
              should.exist(eventstreamSaveRes.body.user);
              should.equal(eventstreamSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (eventstreamInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
