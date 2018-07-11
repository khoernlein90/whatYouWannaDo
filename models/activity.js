const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean
  },
  id: {
    type: String,
    unique: true
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
