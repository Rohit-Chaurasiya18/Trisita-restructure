// src/components/StoreMap.jsx

import React, { useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import conf from "@/conf/conf";
import { useSelector } from "react-redux";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

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
  const { citiesMapChart, citiesMapLoading } = useSelector((state) => ({
    citiesMapChart: state?.dashboard?.citiesMapChart,
    citiesMapLoading: state?.dashboard?.citiesMapLoading,
  }));
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: conf.googleApiKey, // replace with your actual key
  });

  const mapRef = useRef();
  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      const bounds = new window.google.maps.LatLngBounds();
      citiesMapChart
        ?.filter(
          (loc) =>
            !isNaN(parseFloat(loc?.lat)) &&
            !isNaN(parseFloat(loc?.lng)) &&
            isFinite(loc?.lat) &&
            isFinite(loc?.lng)
        )
        .forEach((loc) =>
          bounds.extend({
            lat: parseFloat(loc.lat),
            lng: parseFloat(loc.lng),
          })
        );
      map.fitBounds(bounds);
    },
    [citiesMapChart]
  );

  const [activeMarker, setActiveMarker] = React.useState(null);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <>
      {citiesMapLoading ? (
        <SkeletonLoader isDashboard />
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          onLoad={onMapLoad}
          options={options}
        >
          {citiesMapChart?.length > 0 &&
            citiesMapChart?.map((location, index) => (
              <Marker
                key={index}
                position={{
                  lat: parseFloat(location?.lat),
                  lng: parseFloat(location?.lng),
                }}
                onMouseOver={() => setActiveMarker(index)}
                onMouseOut={() => setActiveMarker(null)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
              >
                {activeMarker === index && (
                  <InfoWindow
                    position={{ lat: location?.lat, lng: location?.lng }}
                  >
                    <div style={{ minWidth: "150px" }}>
                      <strong>{location?.name}</strong>
                      <div>Active: {location?.active}</div>
                      <div>Inactive: {location?.inactive}</div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
        </GoogleMap>
      )}
    </>
  );
};

export default StoreMap;
