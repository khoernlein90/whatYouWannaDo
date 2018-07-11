import React from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

const MyMapComponent = withScriptjs(
  withGoogleMap(props => {
    if (!props.longitude || !props.latitude) {
      return <div>Loading..</div>;
    }
    // console.log(props)
    const cluster = props.markerData.map(location => (
      <Marker
        key={location.id}
        position={{
          lat: location.geometry.location.lat,
          lng: location.geometry.location.lng
        }}
      />
    ));
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{
          lat: props.latitude,
          lng: props.longitude
        }}
      >
        {props.markerData.length === 0 ? (
          <Marker
            position={{
              lat: props.latitude,
              lng: props.longitude
            }}
          />
        ) : (
          <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
            {cluster}
          </MarkerClusterer>
        )}
      </GoogleMap>
    );
  })
);

export default MyMapComponent;
