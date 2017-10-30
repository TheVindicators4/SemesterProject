'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Aboutmessage = mongoose.model('Aboutmessage'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  aboutmessage;

/**
 * Aboutmessage routes tests
 */
describe('Aboutmessage CRUD tests', function () {

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

    // Save a user to the test db and create new aboutmessage
    user.save()
      .then(function () {
        aboutmessage = {
          title: 'Aboutmessage Title',
          content: 'Aboutmessage Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an aboutmessage if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(403)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Call the assertion callback
            done(aboutmessageSaveErr);
          });

      });
  });

  it('should not be able to save an aboutmessage if not logged in', function (done) {
    agent.post('/api/aboutmessages')
      .send(aboutmessage)
      .expect(403)
      .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
        // Call the assertion callback
        done(aboutmessageSaveErr);
      });
  });

  it('should not be able to update an aboutmessage if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(403)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Call the assertion callback
            done(aboutmessageSaveErr);
          });
      });
  });

  it('should be able to get a list of aboutmessages if not signed in', function (done) {
    // Create new aboutmessage model instance
    var aboutmessageObj = new Aboutmessage(aboutmessage);

    // Save the aboutmessage
    aboutmessageObj.save(function () {
      // Request aboutmessages
      agent.get('/api/aboutmessages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single aboutmessage if not signed in', function (done) {
    // Create new aboutmessage model instance
    var aboutmessageObj = new Aboutmessage(aboutmessage);

    // Save the aboutmessage
    aboutmessageObj.save(function () {
      agent.get('/api/aboutmessages/' + aboutmessageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', aboutmessage.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single aboutmessage with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/aboutmessages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Aboutmessage is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single aboutmessage which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent aboutmessage
    agent.get('/api/aboutmessages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No aboutmessage with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an aboutmessage if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(403)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Call the assertion callback
            done(aboutmessageSaveErr);
          });
      });
  });

  it('should not be able to delete an aboutmessage if not signed in', function (done) {
    // Set aboutmessage user
    aboutmessage.user = user;

    // Create new aboutmessage model instance
    var aboutmessageObj = new Aboutmessage(aboutmessage);

    // Save the aboutmessage
    aboutmessageObj.save(function () {
      // Try deleting aboutmessage
      agent.delete('/api/aboutmessages/' + aboutmessageObj._id)
        .expect(403)
        .end(function (aboutmessageDeleteErr, aboutmessageDeleteRes) {
          // Set message assertion
          (aboutmessageDeleteRes.body.message).should.match('User is not authorized');

          // Handle aboutmessage error error
          done(aboutmessageDeleteErr);
        });

    });
  });

  it('should be able to get a single aboutmessage that has an orphaned user reference', function (done) {
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

          // Save a new aboutmessage
          agent.post('/api/aboutmessages')
            .send(aboutmessage)
            .expect(200)
            .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
              // Handle aboutmessage save error
              if (aboutmessageSaveErr) {
                return done(aboutmessageSaveErr);
              }

              // Set assertions on new aboutmessage
              (aboutmessageSaveRes.body.title).should.equal(aboutmessage.title);
              should.exist(aboutmessageSaveRes.body.user);
              should.equal(aboutmessageSaveRes.body.user._id, orphanId);

              // force the aboutmessage to have an orphaned user reference
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

                    // Get the aboutmessage
                    agent.get('/api/aboutmessages/' + aboutmessageSaveRes.body._id)
                      .expect(200)
                      .end(function (aboutmessageInfoErr, aboutmessageInfoRes) {
                        // Handle aboutmessage error
                        if (aboutmessageInfoErr) {
                          return done(aboutmessageInfoErr);
                        }

                        // Set assertions
                        (aboutmessageInfoRes.body._id).should.equal(aboutmessageSaveRes.body._id);
                        (aboutmessageInfoRes.body.title).should.equal(aboutmessage.title);
                        should.equal(aboutmessageInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single aboutmessage if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new aboutmessage model instance
    var aboutmessageObj = new Aboutmessage(aboutmessage);

    // Save the aboutmessage
    aboutmessageObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/aboutmessages/' + aboutmessageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', aboutmessage.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single aboutmessage, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'aboutmessageowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Aboutmessage
    var _aboutmessageOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _aboutmessageOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Aboutmessage
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

          // Save a new aboutmessage
          agent.post('/api/aboutmessages')
            .send(aboutmessage)
            .expect(200)
            .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
              // Handle aboutmessage save error
              if (aboutmessageSaveErr) {
                return done(aboutmessageSaveErr);
              }

              // Set assertions on new aboutmessage
              (aboutmessageSaveRes.body.title).should.equal(aboutmessage.title);
              should.exist(aboutmessageSaveRes.body.user);
              should.equal(aboutmessageSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the aboutmessage
                  agent.get('/api/aboutmessages/' + aboutmessageSaveRes.body._id)
                    .expect(200)
                    .end(function (aboutmessageInfoErr, aboutmessageInfoRes) {
                      // Handle aboutmessage error
                      if (aboutmessageInfoErr) {
                        return done(aboutmessageInfoErr);
                      }

                      // Set assertions
                      (aboutmessageInfoRes.body._id).should.equal(aboutmessageSaveRes.body._id);
                      (aboutmessageInfoRes.body.title).should.equal(aboutmessage.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (aboutmessageInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Aboutmessage.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
