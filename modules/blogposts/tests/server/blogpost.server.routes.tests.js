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
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Blogpost
    user.save(function () {
      blogpost = {
        name: 'Blogpost name'
      };

      done();
    });
  });

  it('should be able to save a Blogpost if logged in', function (done) {
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

        // Save a new Blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(200)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Handle Blogpost save error
            if (blogpostSaveErr) {
              return done(blogpostSaveErr);
            }

            // Get a list of Blogposts
            agent.get('/api/blogposts')
              .end(function (blogpostsGetErr, blogpostsGetRes) {
                // Handle Blogposts save error
                if (blogpostsGetErr) {
                  return done(blogpostsGetErr);
                }

                // Get Blogposts list
                var blogposts = blogpostsGetRes.body;

                // Set assertions
                (blogposts[0].user._id).should.equal(userId);
                (blogposts[0].name).should.match('Blogpost name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Blogpost if not logged in', function (done) {
    agent.post('/api/blogposts')
      .send(blogpost)
      .expect(403)
      .end(function (blogpostSaveErr, blogpostSaveRes) {
        // Call the assertion callback
        done(blogpostSaveErr);
      });
  });

  it('should not be able to save an Blogpost if no name is provided', function (done) {
    // Invalidate name field
    blogpost.name = '';

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

        // Save a new Blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(400)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Set message assertion
            (blogpostSaveRes.body.message).should.match('Please fill Blogpost name');

            // Handle Blogpost save error
            done(blogpostSaveErr);
          });
      });
  });

  it('should be able to update an Blogpost if signed in', function (done) {
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

        // Save a new Blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(200)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Handle Blogpost save error
            if (blogpostSaveErr) {
              return done(blogpostSaveErr);
            }

            // Update Blogpost name
            blogpost.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Blogpost
            agent.put('/api/blogposts/' + blogpostSaveRes.body._id)
              .send(blogpost)
              .expect(200)
              .end(function (blogpostUpdateErr, blogpostUpdateRes) {
                // Handle Blogpost update error
                if (blogpostUpdateErr) {
                  return done(blogpostUpdateErr);
                }

                // Set assertions
                (blogpostUpdateRes.body._id).should.equal(blogpostSaveRes.body._id);
                (blogpostUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Blogposts if not signed in', function (done) {
    // Create new Blogpost model instance
    var blogpostObj = new Blogpost(blogpost);

    // Save the blogpost
    blogpostObj.save(function () {
      // Request Blogposts
      request(app).get('/api/blogposts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Blogpost if not signed in', function (done) {
    // Create new Blogpost model instance
    var blogpostObj = new Blogpost(blogpost);

    // Save the Blogpost
    blogpostObj.save(function () {
      request(app).get('/api/blogposts/' + blogpostObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', blogpost.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Blogpost with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/blogposts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Blogpost is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Blogpost which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Blogpost
    request(app).get('/api/blogposts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Blogpost with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Blogpost if signed in', function (done) {
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

        // Save a new Blogpost
        agent.post('/api/blogposts')
          .send(blogpost)
          .expect(200)
          .end(function (blogpostSaveErr, blogpostSaveRes) {
            // Handle Blogpost save error
            if (blogpostSaveErr) {
              return done(blogpostSaveErr);
            }

            // Delete an existing Blogpost
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

  it('should not be able to delete an Blogpost if not signed in', function (done) {
    // Set Blogpost user
    blogpost.user = user;

    // Create new Blogpost model instance
    var blogpostObj = new Blogpost(blogpost);

    // Save the Blogpost
    blogpostObj.save(function () {
      // Try deleting Blogpost
      request(app).delete('/api/blogposts/' + blogpostObj._id)
        .expect(403)
        .end(function (blogpostDeleteErr, blogpostDeleteRes) {
          // Set message assertion
          (blogpostDeleteRes.body.message).should.match('User is not authorized');

          // Handle Blogpost error error
          done(blogpostDeleteErr);
        });

    });
  });

  it('should be able to get a single Blogpost that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
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

          // Save a new Blogpost
          agent.post('/api/blogposts')
            .send(blogpost)
            .expect(200)
            .end(function (blogpostSaveErr, blogpostSaveRes) {
              // Handle Blogpost save error
              if (blogpostSaveErr) {
                return done(blogpostSaveErr);
              }

              // Set assertions on new Blogpost
              (blogpostSaveRes.body.name).should.equal(blogpost.name);
              should.exist(blogpostSaveRes.body.user);
              should.equal(blogpostSaveRes.body.user._id, orphanId);

              // force the Blogpost to have an orphaned user reference
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

                    // Get the Blogpost
                    agent.get('/api/blogposts/' + blogpostSaveRes.body._id)
                      .expect(200)
                      .end(function (blogpostInfoErr, blogpostInfoRes) {
                        // Handle Blogpost error
                        if (blogpostInfoErr) {
                          return done(blogpostInfoErr);
                        }

                        // Set assertions
                        (blogpostInfoRes.body._id).should.equal(blogpostSaveRes.body._id);
                        (blogpostInfoRes.body.name).should.equal(blogpost.name);
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

  afterEach(function (done) {
    User.remove().exec(function () {
      Blogpost.remove().exec(done);
    });
  });
});
