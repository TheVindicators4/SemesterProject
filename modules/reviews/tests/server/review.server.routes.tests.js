'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Review = mongoose.model('Review'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  review;

/**
 * Review routes tests
 */
describe('Review CRUD tests', function () {

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

    // Save a user to the test db and create new review
    user.save()
      .then(function () {
        review = {
          title: 'Review Title',
          content: 'Review Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an review if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/reviews')
          .send(review)
          .expect(403)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Call the assertion callback
            done(reviewSaveErr);
          });

      });
  });

  it('should not be able to save an review if not logged in', function (done) {
    agent.post('/api/reviews')
      .send(review)
      .expect(403)
      .end(function (reviewSaveErr, reviewSaveRes) {
        // Call the assertion callback
        done(reviewSaveErr);
      });
  });

  it('should not be able to update an review if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/reviews')
          .send(review)
          .expect(403)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Call the assertion callback
            done(reviewSaveErr);
          });
      });
  });

  it('should be able to get a list of reviews if not signed in', function (done) {
    // Create new review model instance
    var reviewObj = new Review(review);

    // Save the review
    reviewObj.save(function () {
      // Request reviews
      agent.get('/api/reviews')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single review if not signed in', function (done) {
    // Create new review model instance
    var reviewObj = new Review(review);

    // Save the review
    reviewObj.save(function () {
      agent.get('/api/reviews/' + reviewObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', review.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single review with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/reviews/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Review is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single review which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent review
    agent.get('/api/reviews/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No review with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an review if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/reviews')
          .send(review)
          .expect(403)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Call the assertion callback
            done(reviewSaveErr);
          });
      });
  });

  it('should not be able to delete an review if not signed in', function (done) {
    // Set review user
    review.user = user;

    // Create new review model instance
    var reviewObj = new Review(review);

    // Save the review
    reviewObj.save(function () {
      // Try deleting review
      agent.delete('/api/reviews/' + reviewObj._id)
        .expect(403)
        .end(function (reviewDeleteErr, reviewDeleteRes) {
          // Set message assertion
          (reviewDeleteRes.body.message).should.match('User is not authorized');

          // Handle review error error
          done(reviewDeleteErr);
        });

    });
  });

  it('should be able to get a single review that has an orphaned user reference', function (done) {
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

          // Save a new review
          agent.post('/api/reviews')
            .send(review)
            .expect(200)
            .end(function (reviewSaveErr, reviewSaveRes) {
              // Handle review save error
              if (reviewSaveErr) {
                return done(reviewSaveErr);
              }

              // Set assertions on new review
              (reviewSaveRes.body.title).should.equal(review.title);
              should.exist(reviewSaveRes.body.user);
              should.equal(reviewSaveRes.body.user._id, orphanId);

              // force the review to have an orphaned user reference
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

                    // Get the review
                    agent.get('/api/reviews/' + reviewSaveRes.body._id)
                      .expect(200)
                      .end(function (reviewInfoErr, reviewInfoRes) {
                        // Handle review error
                        if (reviewInfoErr) {
                          return done(reviewInfoErr);
                        }

                        // Set assertions
                        (reviewInfoRes.body._id).should.equal(reviewSaveRes.body._id);
                        (reviewInfoRes.body.title).should.equal(review.title);
                        should.equal(reviewInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single review if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new review model instance
    var reviewObj = new Review(review);

    // Save the review
    reviewObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/reviews/' + reviewObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', review.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single review, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'reviewowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Review
    var _reviewOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _reviewOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Review
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

          // Save a new review
          agent.post('/api/reviews')
            .send(review)
            .expect(200)
            .end(function (reviewSaveErr, reviewSaveRes) {
              // Handle review save error
              if (reviewSaveErr) {
                return done(reviewSaveErr);
              }

              // Set assertions on new review
              (reviewSaveRes.body.title).should.equal(review.title);
              should.exist(reviewSaveRes.body.user);
              should.equal(reviewSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the review
                  agent.get('/api/reviews/' + reviewSaveRes.body._id)
                    .expect(200)
                    .end(function (reviewInfoErr, reviewInfoRes) {
                      // Handle review error
                      if (reviewInfoErr) {
                        return done(reviewInfoErr);
                      }

                      // Set assertions
                      (reviewInfoRes.body._id).should.equal(reviewSaveRes.body._id);
                      (reviewInfoRes.body.title).should.equal(review.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (reviewInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Review.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
