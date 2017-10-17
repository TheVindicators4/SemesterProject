var path = require('path'),
  express = require('express'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  config = require('./config'),
  listingsRouter = require('../routes/bloglistings.server.routes');

module.exports.init = function () {
  // connect to database
  mongoose.connect(config.db.uri);

  // initialize app
  var app = express();

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());

  /* serve static files */
  app.use('/', express.static(__dirname + '/../../client'));
  app.use('/public', express.static(__dirname + '/../../public'));

  /* use the listings router for requests to the api */
  app.use('/api/listings', listingsRouter);

  /* go to homepage for all routes not specified */
  app.all('/*', function (req, res) {
    res.sendFile(path.resolve('client/views/blog.client.view.html'));
  });

  return app;
};
