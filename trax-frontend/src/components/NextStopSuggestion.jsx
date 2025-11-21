import { useEffect, useState } from "react";
import API from "../api.js";

export default function NearestStopSuggestion({ lat, lng }) {
  const [nearestStop, setNearestStop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFindNearestStop = async () => {
    if (!lat || !lng) {
      setError("Latitude and Longitude not provided.");
      return;
    }

    setLoading(true);
    setError("");
    setNearestStop(null);

    try {
      const res = await API.post("/suggestion/nearestStop", {
        lat,
        lng,
      });

      setNearestStop(res.data.message[0]);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch nearest stop.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Nearest Stop Suggestion</h2>

      <button
        onClick={handleFindNearestStop}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
      >
        {loading ? "Finding..." : "Find Nearest Stop"}
      </button>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      {nearestStop && (
        <div className="mt-4 border p-3 rounded-lg bg-gray-50">
          <p className="text-gray-700">
            <span className="font-semibold">Stop Name:</span> {nearestStop.stop_name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Stop ID:</span> {nearestStop.stop_id}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Distance:</span>{" "}
            {Math.round(nearestStop.distance_meters)} meters
          </p>
        </div>
      )}
    </div>
  );
}
