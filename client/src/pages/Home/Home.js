import React, { Component } from "react";
import { Link } from "react-router-dom";
import API from "../../API/API";
import keys from "../../config/keys";
import "./Home.css";

import List from "../../components/List";
import MyMapComponent from "../../components/MyMapComponent";
import Dropdown from "../../components/Dropdown";
import GoogleButton from "react-google-button";

class App extends Component {
  state = {
    placesToGo: [],
    user: null,
    longitude: 0,
    latitude: 0,
    typeOfActivity: ""
  };

  componentDidMount() {
    API.getLocation().then(data => {
      this.setState({
        longitude: data.data.location.lng,
        latitude: data.data.location.lat
      });
    });
    this.getCurrentUser();
  }

  getCurrentUser() {
    API.getCurrentUser().then(data => {
      this.setState({ user: data.data });
    });
  }

  fetchThingsToDo() {
    if (this.state.typeOfActivity) {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
          this.state.latitude
        },${this.state.longitude}&radius=8046&type=${
          this.state.typeOfActivity
        }&key=${keys.keys.googleAPI || process.env.googleAPIKey}`
      )
        .then(results => {
          return results.json();
        })
        .then(data => {
          this.setState({ placesToGo: data.results });
        });
    } else {
      this.setState({ placesToGo: [] });
    }
  }

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
    setTimeout(() => {
      this.fetchThingsToDo();
    }, 1);
  };

  render() {
    return (
      <div>
        <h1>What do you wanna do?</h1>
        <MyMapComponent
          isMarkerShown
          markerData={this.state.placesToGo}
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${keys.keys
            .googleAPI ||
            process.env
              .googleAPIKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `250px`, width: "100%" }} />}
          mapElement={<div style={{ height: `100%`, width: "100%" }} />}
        />
        {this.state.user === "" ? (
          <a href="/auth/google">
            <GoogleButton style={{ width: "100%" }} type="light" />
          </a>
        ) : (
          <div>
            <Link to="/saved">
              <button className="saved-button">View Saved</button>
            </Link>
            <a href="/api/logout">
              <button className="logout-button">Logout</button>
            </a>
          </div>
        )}

        <Dropdown
          activites={[
            "what_to_do...",
            "restaurant",
            "movie_theater",
            "bar",
            "amusement_park"
          ]}
          fetchActivities={this.fetchThingsToDo}
          handleInputChange={this.handleInputChange}
        />
        <List
          places={this.state.placesToGo}
          location={{ lat: this.state.latitude, long: this.state.longitude }}
          type={this.state.typeOfActivity}
        />
      </div>
    );
  }
}
export default App;
