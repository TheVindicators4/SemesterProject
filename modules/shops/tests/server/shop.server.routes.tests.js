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
describe('Shop CRUD tests', function () {

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

    // Save a user to the test db and create new shop
    user.save()
      .then(function () {
        shop = {
          title: 'Shop Title',
          content: 'Shop Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an shop if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/shops')
          .send(shop)
          .expect(403)
          .end(function (shopSaveErr, shopSaveRes) {
            // Call the assertion callback
            done(shopSaveErr);
          });

      });
  });

  it('should not be able to save an shop if not logged in', function (done) {
    agent.post('/api/shops')
      .send(shop)
      .expect(403)
      .end(function (shopSaveErr, shopSaveRes) {
        // Call the assertion callback
        done(shopSaveErr);
      });
  });

  it('should not be able to update an shop if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/shops')
          .send(shop)
          .expect(403)
          .end(function (shopSaveErr, shopSaveRes) {
            // Call the assertion callback
            done(shopSaveErr);
          });
      });
  });

  it('should be able to get a list of shops if not signed in', function (done) {
    // Create new shop model instance
    var shopObj = new Shop(shop);

    // Save the shop
    shopObj.save(function () {
      // Request shops
      agent.get('/api/shops')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single shop if not signed in', function (done) {
    // Create new shop model instance
    var shopObj = new Shop(shop);

    // Save the shop
    shopObj.save(function () {
      agent.get('/api/shops/' + shopObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', shop.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single shop with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/shops/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Shop is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single shop which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent shop
    agent.get('/api/shops/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No shop with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an shop if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/shops')
          .send(shop)
          .expect(403)
          .end(function (shopSaveErr, shopSaveRes) {
            // Call the assertion callback
            done(shopSaveErr);
          });
      });
  });

  it('should not be able to delete an shop if not signed in', function (done) {
    // Set shop user
    shop.user = user;

    // Create new shop model instance
    var shopObj = new Shop(shop);

    // Save the shop
    shopObj.save(function () {
      // Try deleting shop
      agent.delete('/api/shops/' + shopObj._id)
        .expect(403)
        .end(function (shopDeleteErr, shopDeleteRes) {
          // Set message assertion
          (shopDeleteRes.body.message).should.match('User is not authorized');

          // Handle shop error error
          done(shopDeleteErr);
        });

    });
  });

  it('should be able to get a single shop that has an orphaned user reference', function (done) {
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

          // Save a new shop
          agent.post('/api/shops')
            .send(shop)
            .expect(200)
            .end(function (shopSaveErr, shopSaveRes) {
              // Handle shop save error
              if (shopSaveErr) {
                return done(shopSaveErr);
              }

              // Set assertions on new shop
              (shopSaveRes.body.title).should.equal(shop.title);
              should.exist(shopSaveRes.body.user);
              should.equal(shopSaveRes.body.user._id, orphanId);

              // force the shop to have an orphaned user reference
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
                        should.equal(shopInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single shop if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new shop model instance
    var shopObj = new Shop(shop);

    // Save the shop
    shopObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/shops/' + shopObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', shop.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single shop, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'shopowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Shop
    var _shopOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _shopOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Shop
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

          // Save a new shop
          agent.post('/api/shops')
            .send(shop)
            .expect(200)
            .end(function (shopSaveErr, shopSaveRes) {
              // Handle shop save error
              if (shopSaveErr) {
                return done(shopSaveErr);
              }

              // Set assertions on new shop
              (shopSaveRes.body.title).should.equal(shop.title);
              should.exist(shopSaveRes.body.user);
              should.equal(shopSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (shopInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
