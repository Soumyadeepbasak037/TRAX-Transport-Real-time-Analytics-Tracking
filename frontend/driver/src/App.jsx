// src/App.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [status, setStatus] = useState("Connecting...");
  const [position, setPosition] = useState(null);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJzYjEiLCJyb2xlIjoiZHJpdmVyIiwidmVoaWNsZUlkIjoyLCJpYXQiOjE3NjIwOTExMTYsImV4cCI6MTc2MjA5NDcxNn0.M_qCmZAvDQqD8ux5yWopO5xrqi1xLz1mxHEVz00ja4I"
  const BACKEND_URL = "https://trax-transport-real-time-analytics.onrender.com";

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Connected to backend");
      setStatus("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setStatus("Disconnected");
    });

    let latestLocation = null;

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          latestLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed || 0,
            accuracy: pos.coords.accuracy || 0,
            timestamp: Date.now(),
          };
          setPosition(latestLocation);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );

      const interval = setInterval(() => {
        if (latestLocation) {
          socket.emit("driverLocation", latestLocation);
          console.log("📡 Sent location:", latestLocation.lat, latestLocation.lng);
        }
      }, 1500);

      // Cleanup
      return () => {
        clearInterval(interval);
        navigator.geolocation.clearWatch(watchId);
        socket.disconnect();
      };
    } else {
      console.error("Geolocation not supported.");
    }
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>🚗 Driver App</h1>
      <p>
        Status: <b>{status}</b>
      </p>

      {position ? (
        <div>
          <p>Lat: {position.lat.toFixed(6)}</p>
          <p>Lng: {position.lng.toFixed(6)}</p>
          <p>Speed: {position.speed?.toFixed(2)} m/s</p>
          <p>Accuracy: ±{position.accuracy} m</p>
        </div>
      ) : (
        <p>Waiting for GPS...</p>
      )}
    </div>
  );
}

