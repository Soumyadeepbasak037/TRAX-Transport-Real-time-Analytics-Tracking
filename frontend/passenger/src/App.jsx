// src/App.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function PassengerApp() {
  const [status, setStatus] = useState("Connecting...");
  const [vehicleId, setVehicleId] = useState("");
  const [updates, setUpdates] = useState([]);
  const [socket, setSocket] = useState(null);

  const passengerToken =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJzYl90aGVfcGFzc2VuZ2VyIiwicm9sZSI6InBhc3NlbmdlciIsInZlaGljbGVJZCI6bnVsbCwiaWF0IjoxNzYyMDkxMjg0LCJleHAiOjE3NjIwOTQ4ODR9.I4T9tnz2W64lFppiG9uXEBammy2lW74WraiYEyNQW_g"
  const BACKEND_URL = "https://trax-transport-real-time-analytics.onrender.com";

  useEffect(() => {
    const s = io(BACKEND_URL, {
      auth: { token: passengerToken },
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Passenger connected");
      setStatus("Connected to server");
    });

    s.on("disconnect", () => {
      setStatus("Disconnected");
    });

    s.on("vehicleLocationUpdate", (data) => {
      console.log("📡 Update:", data);
      setUpdates((prev) => [
        {
          vehicleId: data.vehicleId,
          lat: data.lat,
          lng: data.lng,
          speed: data.speed,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    return () => s.disconnect();
  }, []);

  const joinVehicle = () => {
    if (!socket) return;
    const idNum = parseInt(vehicleId);
    if (!idNum) return alert("Enter a valid Vehicle ID");

    socket.emit("passenger:join", { vehicleId: idNum });
    setUpdates((prev) => [
      { vehicleId: idNum, message: `Joined vehicle room ${idNum}` },
      ...prev,
    ]);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>🧍 Passenger App</h1>
      <p>Status: <b>{status}</b></p>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          placeholder="Enter vehicle ID"
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={joinVehicle}>Join Vehicle</button>
      </div>

      <h2>📍 Live Updates:</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {updates.length === 0 ? (
          <p>No updates yet...</p>
        ) : (
          updates.map((u, i) => (
            <p key={i}>
              {u.message
                ? u.message
                : `Vehicle ${u.vehicleId} | Lat: ${u.lat.toFixed(5)}, Lng: ${u.lng.toFixed(5)}, Speed: ${
                    u.speed?.toFixed(1) ?? "N/A"
                  } m/s @ ${u.timestamp}`}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
