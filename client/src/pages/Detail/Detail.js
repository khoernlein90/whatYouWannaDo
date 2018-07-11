import React, { Component } from "react";
import API from "../../API/API";
import { withRouter, Link } from "react-router-dom";
import googleImage from "../../images/btn_google_signin_light_disabled_web@2x.png";
import "./Detail.css";

class Detail extends Component {
  state = {
    imagesClicked: false,
    saved: false,
    disabled: "Save",
    activity: null,
    user: null
  };

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

  deleteSavedActivity(id) {
    API.deleteSavedID(id).then(data => {
      this.setState({ disabled: "Save" });
      this.props.history.push("/saved");
    });
  }

  sendToDetail() {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.props.match.params.id}&key=AIzaSyCS5o2kc-8RX4Zr5AoXrNQdAErazOeF_Ug`)
      .then(results => {
        return results.json();
      })
      .then(activity => {
        this.setState({ activity });
      });
  }
  render() {
    const loginButton =
      this.state.user === "" ? (
        <a href="/auth/google">
          <img alt="google login button" className="google-image" src={googleImage} />
        </a>
      ) : this.state.disabled === "Delete" ? (
        <button className={`saved-button ${this.state.disabled}`} onClick={() => this.deleteSavedActivity(this.state.activity.result.place_id)}>
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
            <p className="phoneNumber">{this.state.activity.result.formatted_phone_number}</p>
            <p className="address">
              <a
                href={`https://maps.google.com/?q=${this.state.activity.result.geometry.location.lat},${
                  this.state.activity.result.geometry.location.lng
                }`}
              >
                {this.state.activity.result.formatted_address}
              </a>
            </p>
            <p className="rating">{this.state.activity.result.rating} rating</p>
            {/* {this.state.disabled === "Delete" ? (
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
            )} */}
            {loginButton}
            <button style={{ width: "100%", color: "white", background: "black", height: "50px" }}>View Uber Price</button>
            <button className="view-image-button" onClick={() => this.showImagesClick()}>
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
            {this.state.saved ? <p className="save-activity">Activity Saved!</p> : ""}
          </div>
        ) : (
          <h1>No Data</h1>
        )}
      </div>
    );
  }
}

export default withRouter(Detail);
