const router = require("express").Router();
const axios = require("axios");

router.get("/locate", (req, res) => {
  axios.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAQ1zvpERs8r5Fsmp3gKpsEurMsez2zq3Y").then(data => {
    res.json(data.data);
    console.log(data.data);
  });
});

module.exports = router;
