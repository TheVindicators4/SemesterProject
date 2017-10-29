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
describe('Review Admin CRUD tests', function () {
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

  it('should be able to save an review if logged in', function (done) {
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

        // Save a new review
        agent.post('/api/reviews')
          .send(review)
          .expect(200)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Handle review save error
            if (reviewSaveErr) {
              return done(reviewSaveErr);
            }

            // Get a list of reviews
            agent.get('/api/reviews')
              .end(function (reviewsGetErr, reviewsGetRes) {
                // Handle review save error
                if (reviewsGetErr) {
                  return done(reviewsGetErr);
                }

                // Get reviews list
                var reviews = reviewsGetRes.body;

                // Set assertions
                (reviews[0].user._id).should.equal(userId);
                (reviews[0].title).should.match('Review Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an review if signed in', function (done) {
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

        // Save a new review
        agent.post('/api/reviews')
          .send(review)
          .expect(200)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Handle review save error
            if (reviewSaveErr) {
              return done(reviewSaveErr);
            }

            // Update review title
            review.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing review
            agent.put('/api/reviews/' + reviewSaveRes.body._id)
              .send(review)
              .expect(200)
              .end(function (reviewUpdateErr, reviewUpdateRes) {
                // Handle review update error
                if (reviewUpdateErr) {
                  return done(reviewUpdateErr);
                }

                // Set assertions
                (reviewUpdateRes.body._id).should.equal(reviewSaveRes.body._id);
                (reviewUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an review if no title is provided', function (done) {
    // Invalidate title field
    review.title = '';

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

        // Save a new review
        agent.post('/api/reviews')
          .send(review)
          .expect(422)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Set message assertion
            (reviewSaveRes.body.message).should.match('Title cannot be blank');

            // Handle review save error
            done(reviewSaveErr);
          });
      });
  });

  it('should be able to delete an review if signed in', function (done) {
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

        // Save a new review
        agent.post('/api/reviews')
          .send(review)
          .expect(200)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Handle review save error
            if (reviewSaveErr) {
              return done(reviewSaveErr);
            }

            // Delete an existing review
            agent.delete('/api/reviews/' + reviewSaveRes.body._id)
              .send(review)
              .expect(200)
              .end(function (reviewDeleteErr, reviewDeleteRes) {
                // Handle review error error
                if (reviewDeleteErr) {
                  return done(reviewDeleteErr);
                }

                // Set assertions
                (reviewDeleteRes.body._id).should.equal(reviewSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single review if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new review model instance
    review.user = user;
    var reviewObj = new Review(review);

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

        // Save a new review
        agent.post('/api/reviews')
          .send(review)
          .expect(200)
          .end(function (reviewSaveErr, reviewSaveRes) {
            // Handle review save error
            if (reviewSaveErr) {
              return done(reviewSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (reviewInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
