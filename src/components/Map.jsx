import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Map = () => {
  const position = [23.8055, 90.4072];

  return (
    <div className="w-full h-[500px] md:h-[600px] border-4 border-primary/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
      <MapContainer
        className="w-full h-full"
        center={position}
        zoom={14}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong className="text-primary font-bold">
              LuxePlan Headquarters
            </strong>{" "}
            <br />
            Banani, Dhaka, Bangladesh
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
