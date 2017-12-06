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
describe('Email Admin CRUD tests', function () {
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

/*  it('should be able to save an email if logged in', function (done) {
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

        // Save a new email
        agent.post('/api/emails')
          .send(email)
          .expect(200)
          .end(function (emailSaveErr, emailSaveRes) {
            // Handle email save error
            if (emailSaveErr) {
              return done(emailSaveErr);
            }

            // Get a list of emails
            agent.get('/api/emails')
              .end(function (emailsGetErr, emailsGetRes) {
                // Handle email save error
                if (emailsGetErr) {
                  return done(emailsGetErr);
                }

                // Get emails list
                var emails = emailsGetRes.body;

                // Set assertions
                (emails[0].user._id).should.equal(userId);
                (emails[0].title).should.match('Email Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an email if signed in', function (done) {
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

        // Save a new email
        agent.post('/api/emails')
          .send(email)
          .expect(200)
          .end(function (emailSaveErr, emailSaveRes) {
            // Handle email save error
            if (emailSaveErr) {
              return done(emailSaveErr);
            }

            // Update email title
            email.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing email
            agent.put('/api/emails/' + emailSaveRes.body._id)
              .send(email)
              .expect(200)
              .end(function (emailUpdateErr, emailUpdateRes) {
                // Handle email update error
                if (emailUpdateErr) {
                  return done(emailUpdateErr);
                }

                // Set assertions
                (emailUpdateRes.body._id).should.equal(emailSaveRes.body._id);
                (emailUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an email if no title is provided', function (done) {
    // Invalidate title field
    email.title = '';

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

        // Save a new email
        agent.post('/api/emails')
          .send(email)
          .expect(422)
          .end(function (emailSaveErr, emailSaveRes) {
            // Set message assertion
            (emailSaveRes.body.message).should.match('Title cannot be blank');

            // Handle email save error
            done(emailSaveErr);
          });
      });
  });

  it('should be able to delete an email if signed in', function (done) {
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

        // Save a new email
        agent.post('/api/emails')
          .send(email)
          .expect(200)
          .end(function (emailSaveErr, emailSaveRes) {
            // Handle email save error
            if (emailSaveErr) {
              return done(emailSaveErr);
            }

            // Delete an existing email
            agent.delete('/api/emails/' + emailSaveRes.body._id)
              .send(email)
              .expect(200)
              .end(function (emailDeleteErr, emailDeleteRes) {
                // Handle email error error
                if (emailDeleteErr) {
                  return done(emailDeleteErr);
                }

                // Set assertions
                (emailDeleteRes.body._id).should.equal(emailSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single email if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new email model instance
    email.user = user;
    var emailObj = new Email(email);

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

        // Save a new email
        agent.post('/api/emails')
          .send(email)
          .expect(200)
          .end(function (emailSaveErr, emailSaveRes) {
            // Handle email save error
            if (emailSaveErr) {
              return done(emailSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (emailInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });*/

  afterEach(function (done) {
    Email.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
