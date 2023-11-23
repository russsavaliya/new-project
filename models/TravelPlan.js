const mongoose = require('mongoose');

const TravelPlan = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "Profiles",
    required: true
  },
  tto_country: {
    type: String,
    required: true
  },
  tto_state: {
    type: String,
    required: true
  },
  tto_place: {
    type: String,
    required: true
  },
  dot_from: {
    type: Date,
    required: true
  },
  dot_to: {
    type: Date,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  activity: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Travelplan', TravelPlan);