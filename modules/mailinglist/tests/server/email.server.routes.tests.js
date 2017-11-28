'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Email = mongoose.model('Email'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  email;

/**
 * Email routes tests
 */
describe('Email CRUD tests', function () {

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

    // Save a user to the test db and create new email
    user.save()
      .then(function () {
        email = {
          title: 'Email Title',
          content: 'Email Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an email if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/emails')
          .send(email)
          .expect(403)
          .end(function (emailSaveErr, emailSaveRes) {
            // Call the assertion callback
            done(emailSaveErr);
          });

      });
  });

  it('should not be able to save an email if not logged in', function (done) {
    agent.post('/api/emails')
      .send(email)
      .expect(403)
      .end(function (emailSaveErr, emailSaveRes) {
        // Call the assertion callback
        done(emailSaveErr);
      });
  });

  it('should not be able to update an email if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/emails')
          .send(email)
          .expect(403)
          .end(function (emailSaveErr, emailSaveRes) {
            // Call the assertion callback
            done(emailSaveErr);
          });
      });
  });

  it('should be able to get a list of emails if not signed in', function (done) {
    // Create new email model instance
    var emailObj = new Email(email);

    // Save the email
    emailObj.save(function () {
      // Request emails
      agent.get('/api/emails')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single email if not signed in', function (done) {
    // Create new email model instance
    var emailObj = new Email(email);

    // Save the email
    emailObj.save(function () {
      agent.get('/api/emails/' + emailObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', email.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single email with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/emails/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Email is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single email which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent email
    agent.get('/api/emails/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No email with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an email if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/emails')
          .send(email)
          .expect(403)
          .end(function (emailSaveErr, emailSaveRes) {
            // Call the assertion callback
            done(emailSaveErr);
          });
      });
  });

  it('should not be able to delete an email if not signed in', function (done) {
    // Set email user
    email.user = user;

    // Create new email model instance
    var emailObj = new Email(email);

    // Save the email
    emailObj.save(function () {
      // Try deleting email
      agent.delete('/api/emails/' + emailObj._id)
        .expect(403)
        .end(function (emailDeleteErr, emailDeleteRes) {
          // Set message assertion
          (emailDeleteRes.body.message).should.match('User is not authorized');

          // Handle email error error
          done(emailDeleteErr);
        });

    });
  });

  it('should be able to get a single email that has an orphaned user reference', function (done) {
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

          // Save a new email
          agent.post('/api/emails')
            .send(email)
            .expect(200)
            .end(function (emailSaveErr, emailSaveRes) {
              // Handle email save error
              if (emailSaveErr) {
                return done(emailSaveErr);
              }

              // Set assertions on new email
              (emailSaveRes.body.title).should.equal(email.title);
              should.exist(emailSaveRes.body.user);
              should.equal(emailSaveRes.body.user._id, orphanId);

              // force the email to have an orphaned user reference
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

                    // Get the email
                    agent.get('/api/emails/' + emailSaveRes.body._id)
                      .expect(200)
                      .end(function (emailInfoErr, emailInfoRes) {
                        // Handle email error
                        if (emailInfoErr) {
                          return done(emailInfoErr);
                        }

                        // Set assertions
                        (emailInfoRes.body._id).should.equal(emailSaveRes.body._id);
                        (emailInfoRes.body.title).should.equal(email.title);
                        should.equal(emailInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single email if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new email model instance
    var emailObj = new Email(email);

    // Save the email
    emailObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/emails/' + emailObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', email.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single email, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'emailowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Email
    var _emailOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _emailOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Email
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

          // Save a new email
          agent.post('/api/emails')
            .send(email)
            .expect(200)
            .end(function (emailSaveErr, emailSaveRes) {
              // Handle email save error
              if (emailSaveErr) {
                return done(emailSaveErr);
              }

              // Set assertions on new email
              (emailSaveRes.body.title).should.equal(email.title);
              should.exist(emailSaveRes.body.user);
              should.equal(emailSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the email
                  agent.get('/api/emails/' + emailSaveRes.body._id)
                    .expect(200)
                    .end(function (emailInfoErr, emailInfoRes) {
                      // Handle email error
                      if (emailInfoErr) {
                        return done(emailInfoErr);
                      }

                      // Set assertions
                      (emailInfoRes.body._id).should.equal(emailSaveRes.body._id);
                      (emailInfoRes.body.title).should.equal(email.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (emailInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Email.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
