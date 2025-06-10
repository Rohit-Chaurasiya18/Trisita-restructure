// src/components/StoreMap.jsx

import React, { useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import conf from "@/conf/conf";

// Sample location data (replace with API data or props)
const locations = [
  { lat: 28.6139, lng: 77.209, name: "Delhi", active: 45, inactive: 34 },
  { lat: 19.076, lng: 72.8777, name: "Mumbai", active: 5, inactive: 347 },
  { lat: 13.0827, lng: 80.2707, name: "Chennai", active: 415, inactive: 374 },
  { lat: 22.5726, lng: 88.3639, name: "Kolkata", active: 459, inactive: 934 },
];

const mapContainerStyle = {
  width: "100%",
  height: "375px",
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
};

const StoreMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: conf.googleApiKey, // replace with your actual key
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((loc) => bounds.extend(loc));
    map.fitBounds(bounds);
  }, []);

  const [activeMarker, setActiveMarker] = React.useState(null);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      onLoad={onMapLoad}
      options={options}
    >
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: location.lat, lng: location.lng }}
          onMouseOver={() => setActiveMarker(index)}
          onMouseOut={() => setActiveMarker(null)}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
        >
          {activeMarker === index && (
            <InfoWindow position={{ lat: location.lat, lng: location.lng }}>
              <div style={{ minWidth: "150px" }}>
                <strong>{location.name}</strong>
                <div>Active: {location.active}</div>
                <div>Inactive: {location.inactive}</div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
};

export default StoreMap;
