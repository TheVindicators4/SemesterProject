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
describe('AboutMessage Admin CRUD tests', function () {
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

  it('should be able to save an aboutMessage if logged in', function (done) {
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

        // Save a new aboutMessage
        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(200)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Handle aboutMessage save error
            if (aboutMessageSaveErr) {
              return done(aboutMessageSaveErr);
            }

            // Get a list of aboutMessages
            agent.get('/api/aboutMessages')
              .end(function (aboutMessagesGetErr, aboutMessagesGetRes) {
                // Handle aboutMessage save error
                if (aboutMessagesGetErr) {
                  return done(aboutMessagesGetErr);
                }

                // Get aboutMessages list
                var aboutMessages = aboutMessagesGetRes.body;

                // Set assertions
                (aboutMessages[0].user._id).should.equal(userId);
                (aboutMessages[0].title).should.match('AboutMessage Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an aboutMessage if signed in', function (done) {
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

        // Save a new aboutMessage
        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(200)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Handle aboutMessage save error
            if (aboutMessageSaveErr) {
              return done(aboutMessageSaveErr);
            }

            // Update aboutMessage title
            aboutMessage.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing aboutMessage
            agent.put('/api/aboutMessages/' + aboutMessageSaveRes.body._id)
              .send(aboutMessage)
              .expect(200)
              .end(function (aboutMessageUpdateErr, aboutMessageUpdateRes) {
                // Handle aboutMessage update error
                if (aboutMessageUpdateErr) {
                  return done(aboutMessageUpdateErr);
                }

                // Set assertions
                (aboutMessageUpdateRes.body._id).should.equal(aboutMessageSaveRes.body._id);
                (aboutMessageUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an aboutMessage if no title is provided', function (done) {
    // Invalidate title field
    aboutMessage.title = '';

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

        // Save a new aboutMessage
        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(422)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Set message assertion
            (aboutMessageSaveRes.body.message).should.match('Title cannot be blank');

            // Handle aboutMessage save error
            done(aboutMessageSaveErr);
          });
      });
  });

  it('should be able to delete an aboutMessage if signed in', function (done) {
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

        // Save a new aboutMessage
        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(200)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Handle aboutMessage save error
            if (aboutMessageSaveErr) {
              return done(aboutMessageSaveErr);
            }

            // Delete an existing aboutMessage
            agent.delete('/api/aboutMessages/' + aboutMessageSaveRes.body._id)
              .send(aboutMessage)
              .expect(200)
              .end(function (aboutMessageDeleteErr, aboutMessageDeleteRes) {
                // Handle aboutMessage error error
                if (aboutMessageDeleteErr) {
                  return done(aboutMessageDeleteErr);
                }

                // Set assertions
                (aboutMessageDeleteRes.body._id).should.equal(aboutMessageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single aboutMessage if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new aboutMessage model instance
    aboutMessage.user = user;
    var aboutMessageObj = new AboutMessage(aboutMessage);

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

        // Save a new aboutMessage
        agent.post('/api/aboutMessages')
          .send(aboutMessage)
          .expect(200)
          .end(function (aboutMessageSaveErr, aboutMessageSaveRes) {
            // Handle aboutMessage save error
            if (aboutMessageSaveErr) {
              return done(aboutMessageSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (aboutMessageInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
