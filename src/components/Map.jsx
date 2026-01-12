import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useTheme } from "../providers/ThemeContext";

const Map = () => {
  const { theme } = useTheme();
  // Center of Bangladesh
  const centerPosition = [23.685, 90.3563];

  const locations = [
    {
      id: 1,
      name: "LuxePlan HQ (Dhaka)",
      address: "Banani, Dhaka",
      position: [23.8055, 90.4072],
    },
    {
      id: 2,
      name: "LuxePlan Chittagong",
      address: "GEC Circle, Chittagong",
      position: [22.3569, 91.7832],
    },
    {
      id: 3,
      name: "LuxePlan Sylhet",
      address: "Zindabazar, Sylhet",
      position: [24.8949, 91.8687],
    },
    {
      id: 4,
      name: "LuxePlan Cox's Bazar",
      address: "Kolatoli, Cox's Bazar",
      position: [21.4272, 92.0058],
    },
    {
      id: 5,
      name: "LuxePlan Khulna",
      address: "Shibbari Mor, Khulna",
      position: [22.8456, 89.5403],
    },
    {
      id: 6,
      name: "LuxePlan Rajshahi",
      address: "Shaheb Bazar, Rajshahi",
      position: [24.3636, 88.6241],
    },
    {
      id: 7,
      name: "LuxePlan Barisal",
      address: "Rupatoli, Barisal",
      position: [22.7010, 90.3535],
    },
    {
      id: 8,
      name: "LuxePlan Rangpur",
      address: "Jahaj Company Mor, Rangpur",
      position: [25.7439, 89.2752],
    },
    {
      id: 9,
      name: "LuxePlan Mymensingh",
      address: "Town Hall, Mymensingh",
      position: [24.7471, 90.4203],
    },
    {
      id: 10,
      name: "LuxePlan Comilla",
      address: "Kandirpar, Comilla",
      position: [23.4607, 91.1809],
    },
    {
      id: 11,
      name: "LuxePlan Bogra",
      address: "Satmatha, Bogra",
      position: [24.8481, 89.3730],
    },
    {
      id: 12,
      name: "LuxePlan Jessore",
      address: "Palbari, Jessore",
      position: [23.1634, 89.2182],
    },
  ];

  // Dynamic Tile URL based on Theme
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-[500px] md:h-[600px] border border-primary/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 relative z-0">
      <MapContainer
        key={theme} // Force re-render on theme change to swap tiles instantly
        className="w-full h-full z-0"
        center={centerPosition}
        zoom={7}
        scrollWheelZoom={false}
      >
        {/* Dynamic Map Style (Light/Dark) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />

        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.position}>
            <Popup className="custom-popup-font">
              <div className="text-center p-1">
                <strong className="text-primary font-serif text-lg block mb-1">
                  {loc.name}
                </strong>
                <span className="text-gray-600 text-sm">{loc.address}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
