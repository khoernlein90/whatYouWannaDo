const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  activities: {
    type: Schema.Types.ObjectId,
    ref: "activity"
  }
});

mongoose.model("users", userSchema);
