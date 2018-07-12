const router = require("express").Router();
const axios = require("axios");
const keys = require("../config/dev");

router.get("/locate", (req, res) => {
  axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${keys.googleAPIKey}`).then(data => {
    res.json(data.data);
    console.log(data.data);
  });
});

module.exports = router;
