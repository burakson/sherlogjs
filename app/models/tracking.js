var mongoose = require('mongoose');

var trackingSchema = mongoose.Schema({
  tracking_data : Object,
  environment: String,
  user_agent: Object,
  referrer: String,
  resolution: String,
  created_at: Date,
  type: Number
}, { collection: 'tracking' });

module.exports = mongoose.model('Tracking', trackingSchema);
