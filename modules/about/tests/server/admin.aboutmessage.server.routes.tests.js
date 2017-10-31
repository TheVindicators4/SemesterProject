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
describe('Aboutmessage Admin CRUD tests', function () {
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

  it('should be able to save an aboutmessage if logged in', function (done) {
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

        // Save a new aboutmessage
        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(200)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Handle aboutmessage save error
            if (aboutmessageSaveErr) {
              return done(aboutmessageSaveErr);
            }

            // Get a list of aboutmessages
            agent.get('/api/aboutmessages')
              .end(function (aboutmessagesGetErr, aboutmessagesGetRes) {
                // Handle aboutmessage save error
                if (aboutmessagesGetErr) {
                  return done(aboutmessagesGetErr);
                }

                // Get aboutmessages list
                var aboutmessages = aboutmessagesGetRes.body;

                // Set assertions
                (aboutmessages[0].user._id).should.equal(userId);
                (aboutmessages[0].title).should.match('Aboutmessage Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an aboutmessage if signed in', function (done) {
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

        // Save a new aboutmessage
        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(200)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Handle aboutmessage save error
            if (aboutmessageSaveErr) {
              return done(aboutmessageSaveErr);
            }

            // Update aboutmessage title
            aboutmessage.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing aboutmessage
            agent.put('/api/aboutmessages/' + aboutmessageSaveRes.body._id)
              .send(aboutmessage)
              .expect(200)
              .end(function (aboutmessageUpdateErr, aboutmessageUpdateRes) {
                // Handle aboutmessage update error
                if (aboutmessageUpdateErr) {
                  return done(aboutmessageUpdateErr);
                }

                // Set assertions
                (aboutmessageUpdateRes.body._id).should.equal(aboutmessageSaveRes.body._id);
                (aboutmessageUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an aboutmessage if no title is provided', function (done) {
    // Invalidate title field
    aboutmessage.title = '';

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

        // Save a new aboutmessage
        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(422)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Set message assertion
            (aboutmessageSaveRes.body.message).should.match('Title cannot be blank');

            // Handle aboutmessage save error
            done(aboutmessageSaveErr);
          });
      });
  });

  it('should be able to delete an aboutmessage if signed in', function (done) {
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

        // Save a new aboutmessage
        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(200)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Handle aboutmessage save error
            if (aboutmessageSaveErr) {
              return done(aboutmessageSaveErr);
            }

            // Delete an existing aboutmessage
            agent.delete('/api/aboutmessages/' + aboutmessageSaveRes.body._id)
              .send(aboutmessage)
              .expect(200)
              .end(function (aboutmessageDeleteErr, aboutmessageDeleteRes) {
                // Handle aboutmessage error error
                if (aboutmessageDeleteErr) {
                  return done(aboutmessageDeleteErr);
                }

                // Set assertions
                (aboutmessageDeleteRes.body._id).should.equal(aboutmessageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single aboutmessage if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new aboutmessage model instance
    aboutmessage.user = user;
    var aboutmessageObj = new Aboutmessage(aboutmessage);

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

        // Save a new aboutmessage
        agent.post('/api/aboutmessages')
          .send(aboutmessage)
          .expect(200)
          .end(function (aboutmessageSaveErr, aboutmessageSaveRes) {
            // Handle aboutmessage save error
            if (aboutmessageSaveErr) {
              return done(aboutmessageSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (aboutmessageInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
