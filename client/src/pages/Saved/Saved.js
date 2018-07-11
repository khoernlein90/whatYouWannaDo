import React, { Component } from "react";
import API from "../../API/API";
import { Link } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import List from "../../components/List";

class Saved extends Component {
  state = {
    places: [],
    typeOfActivity: ""
  };

  componentDidMount() {
    this.getMongoData();
  }

  viewSavedActivites(type) {
    API.viewSavedByType(type).then(data => {
      this.setState({ places: data.data });
    });
  }

  getMongoData() {
    API.getAllSaved().then(res => {
      this.setState({ places: res.data });
    });
  }

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
    setTimeout(() => {
      if (this.state.typeOfActivity === "view_all") {
        return this.getMongoData();
      }
      this.viewSavedActivites(this.state.typeOfActivity);
    }, 1);
  };

  render() {
    return (
      <div>
        <Link to="/">
          <h1>Saved places</h1>
        </Link>
        <Dropdown
          handleInputChange={this.handleInputChange}
          activites={[
            "view_all",
            "restaurant",
            "movie_theater",
            "bar",
            "amusement_park"
          ]}
        />
        <List
          places={this.state.places}
          key={this.state.places.id}
          type={this.state.typeOfActivity}
        />
      </div>
    );
  }
}

export default Saved;
