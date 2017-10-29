'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Blogpost = mongoose.model('Blogpost'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  blogpost;

/**
 * Blogpost routes tests
 */
describe('Blogpost Admin CRUD tests', function () {
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

    // Save a user to the test db and create new blogpost
    user.save()
      .then(function () {
        blogpost = {
          title: 'Blogpost Title',
          content: 'Blogpost Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an blogpost if logged in', function (done) {
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

        // Save a new blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(200)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Handle blogpost save error
            if (blogpostSaveErr) {
              return done(blogpostSaveErr);
            }

            // Get a list of blogposts
            agent.get('/api/blogposts')
              .end(function (blogpostsGetErr, blogpostsGetRes) {
                // Handle blogpost save error
                if (blogpostsGetErr) {
                  return done(blogpostsGetErr);
                }

                // Get blogposts list
                var blogposts = blogpostsGetRes.body;

                // Set assertions
                (blogposts[0].user._id).should.equal(userId);
                (blogposts[0].title).should.match('Blogpost Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an blogpost if signed in', function (done) {
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

        // Save a new blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(200)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Handle blogpost save error
            if (blogpostSaveErr) {
              return done(blogpostSaveErr);
            }

            // Update blogpost title
            blogpost.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing blogpost
            agent.put('/api/blogposts/' + blogpostSaveRes.body._id)
              .send(blogpost)
              .expect(200)
              .end(function (blogpostUpdateErr, blogpostUpdateRes) {
                // Handle blogpost update error
                if (blogpostUpdateErr) {
                  return done(blogpostUpdateErr);
                }

                // Set assertions
                (blogpostUpdateRes.body._id).should.equal(blogpostSaveRes.body._id);
                (blogpostUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an blogpost if no title is provided', function (done) {
    // Invalidate title field
    blogpost.title = '';

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

        // Save a new blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(422)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Set message assertion
            (blogpostSaveRes.body.message).should.match('Title cannot be blank');

            // Handle blogpost save error
            done(blogpostSaveErr);
          });
      });
  });

  it('should be able to delete an blogpost if signed in', function (done) {
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

        // Save a new blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(200)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Handle blogpost save error
            if (blogpostSaveErr) {
              return done(blogpostSaveErr);
            }

            // Delete an existing blogpost
            agent.delete('/api/blogposts/' + blogpostSaveRes.body._id)
              .send(blogpost)
              .expect(200)
              .end(function (blogpostDeleteErr, blogpostDeleteRes) {
                // Handle blogpost error error
                if (blogpostDeleteErr) {
                  return done(blogpostDeleteErr);
                }

                // Set assertions
                (blogpostDeleteRes.body._id).should.equal(blogpostSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single blogpost if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new blogpost model instance
    blogpost.user = user;
    var blogpostObj = new Blogpost(blogpost);

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

        // Save a new blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(200)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Handle blogpost save error
            if (blogpostSaveErr) {
              return done(blogpostSaveErr);
            }

            // Get the blogpost
            agent.get('/api/blogposts/' + blogpostSaveRes.body._id)
              .expect(200)
              .end(function (blogpostInfoErr, blogpostInfoRes) {
                // Handle blogpost error
                if (blogpostInfoErr) {
                  return done(blogpostInfoErr);
                }

                // Set assertions
                (blogpostInfoRes.body._id).should.equal(blogpostSaveRes.body._id);
                (blogpostInfoRes.body.title).should.equal(blogpost.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (blogpostInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Blogpost.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
