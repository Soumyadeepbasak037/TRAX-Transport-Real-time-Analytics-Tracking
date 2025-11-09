import { useEffect, useState } from "react";
import API from "../api.js";

export default function PassengerFormComponent({ sendData }) {
  const [stops, setStops] = useState([]); // store fetched stops
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await API.get("/routeManagement/allStops");

        if (res.data.success && Array.isArray(res.data.message)) {
          setStops(res.data.message); // store stops in state
        }
      } catch (err) {
        console.error("Error fetching stops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();


    const formData = new FormData(e.target);
    const srcStop = formData.get("srcStop");
    const destStop = formData.get("destStop");

    if (srcStop === destStop) {
      alert("Source and destination cannot be the same!");
      return;
    }

    // send stop IDs to parent
    sendData({ srcStop, destStop });
  };

  // Render
  if (loading) return <p>Loading stops...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-xl max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold mb-3">Passenger Trip Form</h2>

      {/* Source stop dropdown */}
      <div className="mb-3">
        <label>Source Stop:</label>
        <select
          name="srcStop"
          required
          className="border px-2 py-1 w-full rounded"
        >
          <option value="">Select Source Stop</option>
          {stops.map((stop) => (
            <option key={stop.stop_id} value={stop.stop_id}>
              {stop.stop_name}
            </option>
          ))}
        </select>
      </div>

      {/* Destination stop dropdown */}
      <div className="mb-3">
        <label>Destination Stop:</label>
        <select
          name="destStop"
          required
          className="border px-2 py-1 w-full rounded"
        >
          <option value="">Select Destination Stop</option>
          {stops.map((stop) => (
            <option key={stop.stop_id} value={stop.stop_id}>
              {stop.stop_name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
