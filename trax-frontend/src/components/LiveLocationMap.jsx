import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix icon issue for Leaflet + React
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LiveLocationMap({ locationData }) {
  if (!locationData) return null;

  const position = [locationData.lat, locationData.lng];

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <MapContainer
        center={position}
        zoom={16}
        className="h-[400px] w-full rounded-xl shadow-lg border border-gray-300"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position} icon={markerIcon}>
          <Popup>
            <div className="text-sm">
              <p><strong>Vehicle:</strong> {locationData.vehicleId}</p>
              <p><strong>Speed:</strong> {locationData.speed} m/s</p>
              <p><strong>Accuracy:</strong> ±{locationData.accuracy} m</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
