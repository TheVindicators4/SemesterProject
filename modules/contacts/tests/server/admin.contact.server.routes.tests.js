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
describe('Contact Admin CRUD tests', function () {
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

  it('should be able to save an contact if logged in', function (done) {
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

        // Save a new contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(200)
          .end(function (contactSaveErr, contactSaveRes) {
            // Handle contact save error
            if (contactSaveErr) {
              return done(contactSaveErr);
            }

            // Get a list of contacts
            agent.get('/api/contacts')
              .end(function (contactsGetErr, contactsGetRes) {
                // Handle contact save error
                if (contactsGetErr) {
                  return done(contactsGetErr);
                }

                // Get contacts list
                var contacts = contactsGetRes.body;

                // Set assertions
                //(contacts[0].user._id).should.equal(userId);
                (contacts[0].title).should.match('Contact Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an contact if signed in', function (done) {
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

        // Save a new contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(200)
          .end(function (contactSaveErr, contactSaveRes) {
            // Handle contact save error
            if (contactSaveErr) {
              return done(contactSaveErr);
            }

            // Update contact title
            contact.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing contact
            agent.put('/api/contacts/' + contactSaveRes.body._id)
              .send(contact)
              .expect(200)
              .end(function (contactUpdateErr, contactUpdateRes) {
                // Handle contact update error
                if (contactUpdateErr) {
                  return done(contactUpdateErr);
                }

                // Set assertions
                (contactUpdateRes.body._id).should.equal(contactSaveRes.body._id);
                (contactUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an contact if no title is provided', function (done) {
    // Invalidate title field
    contact.title = '';

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

        // Save a new contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(422)
          .end(function (contactSaveErr, contactSaveRes) {
            // Set message assertion
            (contactSaveRes.body.message).should.match('Title cannot be blank');

            // Handle contact save error
            done(contactSaveErr);
          });
      });
  });

  it('should be able to delete an contact if signed in', function (done) {
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

        // Save a new contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(200)
          .end(function (contactSaveErr, contactSaveRes) {
            // Handle contact save error
            if (contactSaveErr) {
              return done(contactSaveErr);
            }

            // Delete an existing contact
            agent.delete('/api/contacts/' + contactSaveRes.body._id)
              .send(contact)
              .expect(200)
              .end(function (contactDeleteErr, contactDeleteRes) {
                // Handle contact error error
                if (contactDeleteErr) {
                  return done(contactDeleteErr);
                }

                // Set assertions
                (contactDeleteRes.body._id).should.equal(contactSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single contact if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new contact model instance
    contact.user = user;
    var contactObj = new Contact(contact);

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

        // Save a new contact
        agent.post('/api/contacts')
          .send(contact)
          .expect(200)
          .end(function (contactSaveErr, contactSaveRes) {
            // Handle contact save error
            if (contactSaveErr) {
              return done(contactSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (contactInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
