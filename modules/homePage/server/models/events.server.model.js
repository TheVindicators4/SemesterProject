/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Create your schema */
var eventsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  bodyText: {
    type: String,
    required: true,
    unique: true
  },
  created_at: Date,
  updated_at: Date
});

eventsSchema.pre('save', function (next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if (!this.created_at) {
    this.created_at = currentTime;
  }
  next();
});

/* Use your schema to instantiate a Mongoose model */
var Events = mongoose.model('Events', eventsSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Events;
