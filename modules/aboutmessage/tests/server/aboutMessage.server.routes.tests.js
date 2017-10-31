'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  AboutMessage = mongoose.model('AboutMessage'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  aboutMessage;

/**
 * AboutMessage routes tests
 */
describe('AboutMessage CRUD tests', function () {

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

    // Save a user to the test db and create new aboutMessage
    user.save()
      .then(function () {
        aboutMessage = {
          title: 'AboutMessage Title',
          content: 'AboutMessage Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an aboutMessage if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(403)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Call the assertion callback
            done(aboutMessageSaveErr);
          });

      });
  });

  it('should not be able to save an aboutMessage if not logged in', function (done) {
    agent.post('/api/aboutMessages')
      .send(aboutMessage)
      .expect(403)
      .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
        // Call the assertion callback
        done(aboutMessageSaveErr);
      });
  });

  it('should not be able to update an aboutMessage if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(403)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Call the assertion callback
            done(aboutMessageSaveErr);
          });
      });
  });

  it('should be able to get a list of aboutMessages if not signed in', function (done) {
    // Create new aboutMessage model instance
    var aboutMessageObj = new AboutMessage(aboutMessage);

    // Save the aboutMessage
    aboutMessageObj.save(function () {
      // Request aboutMessages
      agent.get('/api/aboutMessages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single aboutMessage if not signed in', function (done) {
    // Create new aboutMessage model instance
    var aboutMessageObj = new AboutMessage(aboutMessage);

    // Save the aboutMessage
    aboutMessageObj.save(function () {
      agent.get('/api/aboutMessages/' + aboutMessageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', aboutMessage.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single aboutMessage with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/aboutMessages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'AboutMessage is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single aboutMessage which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent aboutMessage
    agent.get('/api/aboutMessages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No aboutMessage with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an aboutMessage if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(403)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Call the assertion callback
            done(aboutMessageSaveErr);
          });
      });
  });

  it('should not be able to delete an aboutMessage if not signed in', function (done) {
    // Set aboutMessage user
    aboutMessage.user = user;

    // Create new aboutMessage model instance
    var aboutMessageObj = new AboutMessage(aboutMessage);

    // Save the aboutMessage
    aboutMessageObj.save(function () {
      // Try deleting aboutMessage
      agent.delete('/api/aboutMessages/' + aboutMessageObj._id)
        .expect(403)
        .end(function (aboutMessageDeleteErr, aboutMessageDeleteRes) {
          // Set message assertion
          (aboutMessageDeleteRes.body.message).should.match('User is not authorized');

          // Handle aboutMessage error error
          done(aboutMessageDeleteErr);
        });

    });
  });

  it('should be able to get a single aboutMessage that has an orphaned user reference', function (done) {
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

          // Save a new aboutMessage
          agent.post('/api/aboutMessages')
            .send(aboutMessage)
            .expect(200)
            .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
              // Handle aboutMessage save error
              if (aboutMessageSaveErr) {
                return done(aboutMessageSaveErr);
              }

              // Set assertions on new aboutMessage
              (aboutMessageSaveRes.body.title).should.equal(aboutMessage.title);
              should.exist(aboutMessageSaveRes.body.user);
              should.equal(aboutMessageSaveRes.body.user._id, orphanId);

              // force the aboutMessage to have an orphaned user reference
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

                    // Get the aboutMessage
                    agent.get('/api/aboutMessages/' + aboutMessageSaveRes.body._id)
                      .expect(200)
                      .end(function (aboutMessageInfoErr, aboutMessageInfoRes) {
                        // Handle aboutMessage error
                        if (aboutMessageInfoErr) {
                          return done(aboutMessageInfoErr);
                        }

                        // Set assertions
                        (aboutMessageInfoRes.body._id).should.equal(aboutMessageSaveRes.body._id);
                        (aboutMessageInfoRes.body.title).should.equal(aboutMessage.title);
                        should.equal(aboutMessageInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single aboutMessage if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new aboutMessage model instance
    var aboutMessageObj = new AboutMessage(aboutMessage);

    // Save the aboutMessage
    aboutMessageObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/aboutMessages/' + aboutMessageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', aboutMessage.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single aboutMessage, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'aboutMessageowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the AboutMessage
    var _aboutMessageOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _aboutMessageOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the AboutMessage
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

          // Save a new aboutMessage
          agent.post('/api/aboutMessages')
            .send(aboutMessage)
            .expect(200)
            .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
              // Handle aboutMessage save error
              if (aboutMessageSaveErr) {
                return done(aboutMessageSaveErr);
              }

              // Set assertions on new aboutMessage
              (aboutMessageSaveRes.body.title).should.equal(aboutMessage.title);
              should.exist(aboutMessageSaveRes.body.user);
              should.equal(aboutMessageSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the aboutMessage
                  agent.get('/api/aboutMessages/' + aboutMessageSaveRes.body._id)
                    .expect(200)
                    .end(function (aboutMessageInfoErr, aboutMessageInfoRes) {
                      // Handle aboutMessage error
                      if (aboutMessageInfoErr) {
                        return done(aboutMessageInfoErr);
                      }

                      // Set assertions
                      (aboutMessageInfoRes.body._id).should.equal(aboutMessageSaveRes.body._id);
                      (aboutMessageInfoRes.body.title).should.equal(aboutMessage.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (aboutMessageInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    AboutMessage.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
