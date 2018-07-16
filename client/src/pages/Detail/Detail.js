import React, { Component } from "react";
import API from "../../API/API";
import { withRouter, Link } from "react-router-dom";
import keys from "../../config/keys";
import GoogleButton from "react-google-button";

import "./Detail.css";

class Detail extends Component {
  state = {
    imagesClicked: false,
    saved: false,
    disabled: "Save",
    activity: null,
    user: null,
    uberMessage: "GET AN UBER HERE",
    uberLoginStatus: false,
    uberPricesChecked: false,
    startLocation: this.props.location.state.location,
    uberFareId: null
  };
  // this.state.activity.result.geometry.location,
  componentDidMount() {
    this.sendToDetail();
    this.viewSavedActivity();
    this.getCurrentUser();
    // this.setState({ activityId: this.props.match.params.id });
  }

  getCurrentUser() {
    API.getCurrentUser().then(data => {
      this.setState({ user: data.data });
    });
  }
  showImagesClick() {
    this.setState({ imagesClicked: !this.state.imagesClicked });
  }

  saveNewActivity = (name, rating, type, saved, id) => {
    API.saveData({ name, rating, type, saved, id }).then(data => {
      this.setState({ saved: true, disabled: "Delete" });
      setTimeout(() => {
        this.setState({ saved: false });
      }, 1200);
    });
  };

  viewSavedActivity() {
    API.viewSavedByID(this.props.match.params.id).then(data => {
      if (data.data.length) {
        if (data.data[0].saved) {
          this.setState({ disabled: "Delete" });
        }
      }
    });
  }

  viewUberPrice = event => {
    event.preventDefault();

    API.viewUberPrices(
      this.state.startLocation.lat,
      this.state.startLocation.long,
      this.state.activity.result.geometry.location.lat,
      this.state.activity.result.geometry.location.lng
    ).then(data => {
      console.log(data);
      this.setState({
        uberMessage: `YOUR UBER WILL COST ABOUT: ${data.data.fare.display}`,
        uberPricesChecked: true,
        uberFareId: data.data.fare.fare_id
      });
    });
  };

  orderUber = event => {
    event.preventDefault();
    API.requestUberRide(
      this.state.startLocation.lat,
      this.state.startLocation.long,
      this.state.activity.result.geometry.location.lat,
      this.state.activity.result.geometry.location.lng,
      this.state.uberFareId
    ).then(data => console.log(data));
    this.setState({
      uberMessage: "YOUR UBER IS ON THE WAY"
    });
  };

  loginWithUber = event => {
    event.preventDefault();
    this.setState({
      uberLoginStatus: true,
      uberMessage: "VIEW UBER PRICES"
    });
  };
  deleteSavedActivity(id) {
    API.deleteSavedID(id).then(data => {
      this.setState({ disabled: "Save" });
      this.props.history.push("/saved");
    });
  }

  sendToDetail() {
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
        this.props.match.params.id
      }&key=${keys.keys.googlePlacesKey || process.env.googlePlacesKey}`
    )
      .then(results => {
        return results.json();
      })
      .then(activity => {
        this.setState({ activity });
      });
  }
  render() {
    console.log(this.state);
    let uberButtonHandler;
    if (!this.state.uberLoginStatus && !this.state.uberPricesChecked) {
      uberButtonHandler = event => this.loginWithUber(event);
    } else if (this.state.uberLoginStatus && !this.state.uberPricesChecked) {
      uberButtonHandler = event => this.viewUberPrice(event);
    } else {
      uberButtonHandler = event => this.orderUber(event);
    }
    const loginButton =
      this.state.user === "" ? (
        <a href="/auth/google">
          <GoogleButton style={{ width: "100%" }} type="light" />
        </a>
      ) : this.state.disabled === "Delete" ? (
        <button
          className={`saved-button ${this.state.disabled}`}
          onClick={() =>
            this.deleteSavedActivity(this.state.activity.result.place_id)
          }
        >
          {this.state.disabled}
        </button>
      ) : (
        <button
          className={`saved-button ${this.state.disabled}`}
          onClick={() =>
            this.saveNewActivity(
              this.state.activity.result.name,
              this.state.activity.result.rating.toString(),
              this.props.match.params.type,
              true,
              this.props.match.params.id
            )
          }
        >
          {this.state.disabled}
        </button>
      );

    return (
      <div>
        {this.state.activity ? (
          <div>
            <Link to="/">
              <h1>{this.state.activity.result.name}</h1>
            </Link>
            <p className="phoneNumber">
              {this.state.activity.result.formatted_phone_number}
            </p>
            <p className="address">
              <a
                href={`https://maps.google.com/?q=${
                  this.state.activity.result.geometry.location.lat
                },${this.state.activity.result.geometry.location.lng}`}
              >
                {this.state.activity.result.formatted_address}
              </a>
            </p>
            <p className="rating">{this.state.activity.result.rating} rating</p>
            {loginButton}
            <a href="/api/uber/login" onClick={uberButtonHandler}>
              <button className="uber-button">{this.state.uberMessage}</button>
            </a>

            <button
              className="view-image-button"
              onClick={() => this.showImagesClick()}
            >
              View Images
            </button>
            {this.state.imagesClicked ? (
              <div>
                {this.state.activity.result.photos ? (
                  this.state.activity.result.photos.map(image => (
                    <img
                      className="the-image"
                      key={image.photo_reference}
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${
                        image.photo_reference
                      }&key=AIzaSyCS5o2kc-8RX4Zr5AoXrNQdAErazOeF_Ug`}
                      alt=""
                    />
                  ))
                ) : (
                  <p className="no-images">No images to display</p>
                )}
              </div>
            ) : (
              ""
            )}
            {this.state.saved ? (
              <p className="save-activity">Activity Saved!</p>
            ) : (
              ""
            )}
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    );
  }
}

export default withRouter(Detail);
