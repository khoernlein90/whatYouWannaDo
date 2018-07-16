const router = require("express").Router();
const Uber = require("node-uber");
const keys = require("../config/dev");

let bestUber;
let reqID;
let accessToken;

const uber = new Uber({
  client_id: keys.uberClientID,
  client_secret: keys.uberSecret,
  server_token: keys.uberServerToken,
  redirect_uri: "http://localhost:3000/api/uber/redirect",
  name: "MyHangoutApp",
  sandbox: true // optional, defaults to false
});

router.get("/login", (request, response) => {
  const url = uber.getAuthorizeUrl(["history", "profile", "request", "places"]);
  response.redirect(url);
});

router.get("/logout", (req, response) => {
  uber.revokeTokenAsync(accessToken);
  response.send("logged out");
});

router.get("/redirect", (request, response) => {
  uber
    .authorizationAsync({ authorization_code: request.query.code })
    .spread(
      (access_token, refresh_token, authorizedScopes, tokenExpiration) => {
        // store the user id and associated access_token, refresh_token, scopes and token expiration date
        accessToken = access_token;
        console.log("New access_token retrieved: " + access_token);
        console.log("... token allows access to scopes: " + authorizedScopes);
        console.log("... token is valid until: " + tokenExpiration);
        console.log(
          "... after token expiration, re-authorize using refresh_token: " +
            refresh_token
        );

        // redirect the user back to your actual router
        response.redirect("back");
      }
    )
    .error(err => {
      console.error(err);
    });
});

router.get(
  "/estimate/:startLat/:startLong/:endLat/:endLong",
  (req, response) => {
    //   uber.estimates
    //     .getPriceForRouteAsync(startLat, startLong, endLat, endLong)
    //     .then(res => {
    //       for (var i = 0; i < res.prices.length; i++) {
    //         const item = res.prices[i];
    //         if (item.low_estimate < lowCost) {
    //           lowCost = item.low_estimate;
    //           bestUber = item;
    //         }
    //       }
    //     })
    // .then(() => {
    uber.requests
      .getEstimatesAsync({
        //   product_id: bestUber.product_id,
        start_latitude: req.params.startLat,
        start_longitude: req.params.startLong,
        end_latitude: req.params.endLat,
        end_longitude: req.params.endLong
      })
      .then(res => {
        response.json(res);
        fare = res.fare.fare_id;
      })
      // })
      .error(err => {
        console.error(err);
      });
  }
);

// router.get("/testing", (req, response) => {
//   uber.requests
//     .getEstimatesAsync({
//       product_id: bestUber.product_id,
//       start_latitude: startLat,
//       start_longitude: startLong,
//       end_latitude: endLat,
//       end_longitude: endLong
//     })
//     .then(res => {
//       response.json(res);
//       fare = res.fare.fare_id;
//     })
//     .error(err => {
//       console.error(err);
//     });
// });

router.get(
  "/request/:startLat/:startLong/:endLat/:endLong/:fareId",
  (req, response) => {
    uber.requests
      .createAsync({
        fare_id: req.params.fareId,
        start_latitude: req.params.startLat,
        start_longitude: req.params.startLong,
        end_latitude: req.params.endLat,
        end_longitude: req.params.endLong
      })
      .then(res => {
        reqID = res.request_id;
        response.json(res);
      })
      .error(err => {
        console.error(err);
      });
  }
);

router.get("/current", (req, response) => {
  uber.requests
    .getCurrentAsync()
    .then(res => {
      response.json(res);
    })
    .error(err => {
      console.error(err);
    });
});

router.get("/delete", (req, response) => {
  uber.requests
    .deleteCurrentAsync()
    .then(res => {
      // console.log(res);
      response.end();
    })
    .error(err => {
      console.error(err);
    });
});

// router.get("/update", (req, response) => {
//   uber.requests
//     .setStatusByIDAsync(reqID, "accepted")
//     .then(res => {
//       console.log(res);
//       response.end();
//     })
//     .error(err => {
//       console.error(err);
//     });
// });

// router.get("/map", (req, response) => {
//   uber.requests
//     .getMapByIDAsync(reqID)
//     .then(res => {
//       response.json(res);
//     })
//     .error(err => {
//       console.error(err);
//     });
// });

module.exports = router;
