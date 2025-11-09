// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api.js";
// import RouteList from "../components/RouteList.jsx";
// import ActiveTripsCard from "../components/ActiveTripsCard.jsx";
import io from "socket.io-client";
import PassengerFormComponent from "../components/PassengerForm.jsx";



export default function PassengerPage() {
  const [suggestedRoutes,setSuggestedRoutes] = useState([])
  const [suggestedVehicles,setSuggestedVehicles] = useState(null)

  const handleSendData = async({ srcStop, destStop }) => {
    console.log("Selected stops:", srcStop, destStop);

    const res = await API.post("/suggestion/singleHopSuggestion",{
      src_id: srcStop,
      dest_id: destStop,
    })
    console.log(res.data.message)
    console.log(res.data.message.map((route_object) => route_object.route_id));
    setSuggestedRoutes(res.data.message.map((route_object) => route_object.route_id))
    console.log(suggestedRoutes)
    

  };

  return (
    <div className="p-6">
      <PassengerFormComponent sendData={handleSendData} />
    </div>
  );
}
