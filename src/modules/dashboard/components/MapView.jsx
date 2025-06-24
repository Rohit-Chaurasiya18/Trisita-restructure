import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import SkeletonLoader from "@/components/common/loaders/Skeleton";

// Fix missing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const MapView = () => {
  const { citiesMapChart, citiesMapLoading } = useSelector((state) => ({
    citiesMapChart: state?.dashboard?.citiesMapChart,
    citiesMapLoading: state?.dashboard?.citiesMapLoading,
  }));
  // ✅ Prevent rendering during SSR
  if (typeof window === "undefined") return null;
  return (
    <>
      {citiesMapLoading ? (
        <SkeletonLoader />
      ) : (
        <MapContainer
          center={[22.572646, 88.363895]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {citiesMapChart?.length > 0 &&
            citiesMapChart.map((city, idx) => (
              <Marker key={idx} position={city.coords}>
                <Popup>
                  <strong>{city.name}</strong>
                  <br />
                  Active: {city.active}
                  <br />
                  Expired: {city.expired}
                  <br />
                  Total: {city.active + city.expired}
                </Popup>
                <Tooltip sticky>{city.name}</Tooltip>
              </Marker>
            ))}
        </MapContainer>
      )}
    </>
  );
};

export default MapView;
