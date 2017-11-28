'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shop = mongoose.model('Shop'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  shop;

/**
 * Shop routes tests
 */
describe('Shop Admin CRUD tests', function () {
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

    // Save a user to the test db and create new shop
    user.save()
      .then(function () {
        shop = {
          title: 'Shop Title',
          content: 'Shop Content'

          //new variables
          //urlImage: 'https://drive.google.com/thumbnail?id=1FyzLIlb66lSrydF6H0dYix1fCDDRk6O3'
          //url: 'https://www.amazon.com/'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an shop if logged in', function (done) {
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

        // Save a new shop
        agent.post('/api/shops')
          .send(shop)
          .expect(200)
          .end(function (shopSaveErr, shopSaveRes) {
            // Handle shop save error
            if (shopSaveErr) {
              return done(shopSaveErr);
            }

            // Get a list of shops
            agent.get('/api/shops')
              .end(function (shopsGetErr, shopsGetRes) {
                // Handle shop save error
                if (shopsGetErr) {
                  return done(shopsGetErr);
                }

                // Get shops list
                var shops = shopsGetRes.body;

                // Set assertions
                (shops[0].user._id).should.equal(userId);
                (shops[0].title).should.match('Shop Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an shop if signed in', function (done) {
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

        // Save a new shop
        agent.post('/api/shops')
          .send(shop)
          .expect(200)
          .end(function (shopSaveErr, shopSaveRes) {
            // Handle shop save error
            if (shopSaveErr) {
              return done(shopSaveErr);
            }

            // Update shop title
            shop.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing shop
            agent.put('/api/shops/' + shopSaveRes.body._id)
              .send(shop)
              .expect(200)
              .end(function (shopUpdateErr, shopUpdateRes) {
                // Handle shop update error
                if (shopUpdateErr) {
                  return done(shopUpdateErr);
                }

                // Set assertions
                (shopUpdateRes.body._id).should.equal(shopSaveRes.body._id);
                (shopUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an shop if no title is provided', function (done) {
    // Invalidate title field
    shop.title = '';

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

        // Save a new shop
        agent.post('/api/shops')
          .send(shop)
          .expect(422)
          .end(function (shopSaveErr, shopSaveRes) {
            // Set message assertion
            (shopSaveRes.body.message).should.match('Title cannot be blank');

            // Handle shop save error
            done(shopSaveErr);
          });
      });
  });

  it('should be able to delete an shop if signed in', function (done) {
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

        // Save a new shop
        agent.post('/api/shops')
          .send(shop)
          .expect(200)
          .end(function (shopSaveErr, shopSaveRes) {
            // Handle shop save error
            if (shopSaveErr) {
              return done(shopSaveErr);
            }

            // Delete an existing shop
            agent.delete('/api/shops/' + shopSaveRes.body._id)
              .send(shop)
              .expect(200)
              .end(function (shopDeleteErr, shopDeleteRes) {
                // Handle shop error error
                if (shopDeleteErr) {
                  return done(shopDeleteErr);
                }

                // Set assertions
                (shopDeleteRes.body._id).should.equal(shopSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single shop if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new shop model instance
    shop.user = user;
    var shopObj = new Shop(shop);

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

        // Save a new shop
        agent.post('/api/shops')
          .send(shop)
          .expect(200)
          .end(function (shopSaveErr, shopSaveRes) {
            // Handle shop save error
            if (shopSaveErr) {
              return done(shopSaveErr);
            }

            // Get the shop
            agent.get('/api/shops/' + shopSaveRes.body._id)
              .expect(200)
              .end(function (shopInfoErr, shopInfoRes) {
                // Handle shop error
                if (shopInfoErr) {
                  return done(shopInfoErr);
                }

                // Set assertions
                (shopInfoRes.body._id).should.equal(shopSaveRes.body._id);
                (shopInfoRes.body.title).should.equal(shop.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (shopInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Shop.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
