// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api.js";
// import RouteList from "../components/RouteList.jsx";
// import ActiveTripsCard from "../components/ActiveTripsCard.jsx";
import io from "socket.io-client";



export default function PassengerDashboard() {
    // const [locationData, setLocationData] = useState(null);

      const handlePassengerSubmit = async ({ srcStop, destStop }) => {
    console.log("Form data:", srcStop, destStop);

    // Example: send to backend
    const res = await fetch("http://localhost:3000/api/suggestion/singleHopSuggestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ srcStop, destStop }),
    });

    const data = await res.json();
    console.log("Server response:", data);
  };

  return (
    <div className="p-6">
      <PassengerForm onSubmit={handlePassengerSubmit} />
    </div>
  );

}