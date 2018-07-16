import React from "react";
import { Link } from "react-router-dom";
import "./List.css";

const List = props => {
  const places = props.places.map(place => {
    return (
      <div className="main-list-div" key={place.id}>
        <Link
          to={{
            pathname: `/activity/${place.place_id || place.id}/${props.type ||
              place.type}`,
            state: { location: props.location }
          }}
        >
          <h4
            place-id={place.place_id}
            data-rating={place.rating}
            data-name={place.name}
          >
            {place.name}
          </h4>
        </Link>
        <p>
          Rating: <span>{place.rating}</span>
        </p>
      </div>
    );
  });
  return <div>{places}</div>;
};

export default List;
