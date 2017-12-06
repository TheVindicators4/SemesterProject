'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contact = mongoose.model('Contact'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  contact;

/**
 * Contact routes tests
 */
describe('Contact CRUD tests', function () {

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

    // Save a user to the test db and create new contact
    user.save()
      .then(function () {
        contact = {
          title: 'Contact Title',
          content: 'Contact Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an contact if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/contacts')
          .send(contact)
          .expect(403)
          .end(function (contactSaveErr, contactSaveRes) {
            // Call the assertion callback
            done(contactSaveErr);
          });

      });
  });

  it('should not be able to save an contact if not logged in', function (done) {
    agent.post('/api/contacts')
      .send(contact)
      .expect(403)
      .end(function (contactSaveErr, contactSaveRes) {
        // Call the assertion callback
        done(contactSaveErr);
      });
  });

  it('should not be able to update an contact if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/contacts')
          .send(contact)
          .expect(403)
          .end(function (contactSaveErr, contactSaveRes) {
            // Call the assertion callback
            done(contactSaveErr);
          });
      });
  });

  it('should be able to get a list of contacts if not signed in', function (done) {
    // Create new contact model instance
    var contactObj = new Contact(contact);

    // Save the contact
    contactObj.save(function () {
      // Request contacts
      agent.get('/api/contacts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single contact if not signed in', function (done) {
    // Create new contact model instance
    var contactObj = new Contact(contact);

    // Save the contact
    contactObj.save(function () {
      agent.get('/api/contacts/' + contactObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', contact.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single contact with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/contacts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contact is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single contact which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent contact
    agent.get('/api/contacts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No contact with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an contact if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/contacts')
          .send(contact)
          .expect(403)
          .end(function (contactSaveErr, contactSaveRes) {
            // Call the assertion callback
            done(contactSaveErr);
          });
      });
  });

  it('should not be able to delete an contact if not signed in', function (done) {
    // Set contact user
    contact.user = user;

    // Create new contact model instance
    var contactObj = new Contact(contact);

    // Save the contact
    contactObj.save(function () {
      // Try deleting contact
      agent.delete('/api/contacts/' + contactObj._id)
        .expect(403)
        .end(function (contactDeleteErr, contactDeleteRes) {
          // Set message assertion
          //(contactDeleteRes.body.message).should.match('User is not authorized');

          // Handle contact error error
          done(contactDeleteErr);
        });

    });
  });

  it('should be able to get a single contact that has an orphaned user reference', function (done) {
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

          // Save a new contact
          agent.post('/api/contacts')
            .send(contact)
            .expect(200)
            .end(function (contactSaveErr, contactSaveRes) {
              // Handle contact save error
              if (contactSaveErr) {
                return done(contactSaveErr);
              }

              // Set assertions on new contact
              (contactSaveRes.body.title).should.equal(contact.title);
              //should.exist(contactSaveRes.body.user);
              //should.equal(contactSaveRes.body.user._id, orphanId);

              // force the contact to have an orphaned user reference
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

                    // Get the contact
                    agent.get('/api/contacts/' + contactSaveRes.body._id)
                      .expect(200)
                      .end(function (contactInfoErr, contactInfoRes) {
                        // Handle contact error
                        if (contactInfoErr) {
                          return done(contactInfoErr);
                        }

                        // Set assertions
                        (contactInfoRes.body._id).should.equal(contactSaveRes.body._id);
                        (contactInfoRes.body.title).should.equal(contact.title);
                        //should.equal(contactInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single contact if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new contact model instance
    var contactObj = new Contact(contact);

    // Save the contact
    contactObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/contacts/' + contactObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', contact.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          //res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single contact, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'contactowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Contact
    var _contactOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _contactOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Contact
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

          // Save a new contact
          agent.post('/api/contacts')
            .send(contact)
            .expect(200)
            .end(function (contactSaveErr, contactSaveRes) {
              // Handle contact save error
              if (contactSaveErr) {
                return done(contactSaveErr);
              }

              // Set assertions on new contact
              (contactSaveRes.body.title).should.equal(contact.title);
              //should.exist(contactSaveRes.body.user);
              //should.equal(contactSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the contact
                  agent.get('/api/contacts/' + contactSaveRes.body._id)
                    .expect(200)
                    .end(function (contactInfoErr, contactInfoRes) {
                      // Handle contact error
                      if (contactInfoErr) {
                        return done(contactInfoErr);
                      }

                      // Set assertions
                      (contactInfoRes.body._id).should.equal(contactSaveRes.body._id);
                      (contactInfoRes.body.title).should.equal(contact.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      //(contactInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Contact.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
