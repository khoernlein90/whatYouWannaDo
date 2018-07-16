const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const app = express();
const PORT = process.env.PORT || 3001;

const activityRoutes = require("./routes/activities");
const authRoutes = require("./routes/authRoutes");
const uberRoutes = require("./routes/uberRoutes");
const locator = require("./routes/locator");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets
app.use(express.static("client/build"));
// Add routes, both API and view

app.use(
  cookieSession({
    // maxAge - how long cookie can exist before it automatically expires
    // maxAge = 30 days * 24 hrs/day * 60 min/hr * 60 sec/min * 1000 ms/min
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/uber", uberRoutes);
app.use(authRoutes);
app.use(activityRoutes);
app.use(locator);
// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/whatYouWannaDo"
);

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
