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
describe('Blogpost CRUD tests', function () {

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

  it('should not be able to save an blogpost if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(403)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Call the assertion callback
            done(blogpostSaveErr);
          });

      });
  });

  it('should not be able to save an blogpost if not logged in', function (done) {
    agent.post('/api/blogposts')
      .send(blogpost)
      .expect(403)
      .end(function (blogpostSaveErr, blogpostSaveRes) {
        // Call the assertion callback
        done(blogpostSaveErr);
      });
  });

  it('should not be able to update an blogpost if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(403)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Call the assertion callback
            done(blogpostSaveErr);
          });
      });
  });

  it('should be able to get a list of blogposts if not signed in', function (done) {
    // Create new blogpost model instance
    var blogpostObj = new Blogpost(blogpost);

    // Save the blogpost
    blogpostObj.save(function () {
      // Request blogposts
      agent.get('/api/blogposts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single blogpost if not signed in', function (done) {
    // Create new blogpost model instance
    var blogpostObj = new Blogpost(blogpost);

    // Save the blogpost
    blogpostObj.save(function () {
      agent.get('/api/blogposts/' + blogpostObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', blogpost.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single blogpost with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/blogposts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Blogpost is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single blogpost which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent blogpost
    agent.get('/api/blogposts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No blogpost with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an blogpost if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(403)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Call the assertion callback
            done(blogpostSaveErr);
          });
      });
  });

  it('should not be able to delete an blogpost if not signed in', function (done) {
    // Set blogpost user
    blogpost.user = user;

    // Create new blogpost model instance
    var blogpostObj = new Blogpost(blogpost);

    // Save the blogpost
    blogpostObj.save(function () {
      // Try deleting blogpost
      agent.delete('/api/blogposts/' + blogpostObj._id)
        .expect(403)
        .end(function (blogpostDeleteErr, blogpostDeleteRes) {
          // Set message assertion
          (blogpostDeleteRes.body.message).should.match('User is not authorized');

          // Handle blogpost error error
          done(blogpostDeleteErr);
        });

    });
  });

  it('should be able to get a single blogpost that has an orphaned user reference', function (done) {
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

          // Save a new blogpost
          agent.post('/api/blogposts')
            .send(blogpost)
            .expect(200)
            .end(function (blogpostSaveErr, blogpostSaveRes) {
              // Handle blogpost save error
              if (blogpostSaveErr) {
                return done(blogpostSaveErr);
              }

              // Set assertions on new blogpost
              (blogpostSaveRes.body.title).should.equal(blogpost.title);
              should.exist(blogpostSaveRes.body.user);
              should.equal(blogpostSaveRes.body.user._id, orphanId);

              // force the blogpost to have an orphaned user reference
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
                        should.equal(blogpostInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single blogpost if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new blogpost model instance
    var blogpostObj = new Blogpost(blogpost);

    // Save the blogpost
    blogpostObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/blogposts/' + blogpostObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', blogpost.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single blogpost, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'blogpostowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Blogpost
    var _blogpostOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _blogpostOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Blogpost
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

          // Save a new blogpost
          agent.post('/api/blogposts')
            .send(blogpost)
            .expect(200)
            .end(function (blogpostSaveErr, blogpostSaveRes) {
              // Handle blogpost save error
              if (blogpostSaveErr) {
                return done(blogpostSaveErr);
              }

              // Set assertions on new blogpost
              (blogpostSaveRes.body.title).should.equal(blogpost.title);
              should.exist(blogpostSaveRes.body.user);
              should.equal(blogpostSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (blogpostInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
