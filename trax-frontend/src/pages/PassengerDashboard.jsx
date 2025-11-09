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

    const routesSuggestion = await API.post("/suggestion/singleHopSuggestion",{
      src_id: srcStop,
      dest_id: destStop,
    })
    console.log(routesSuggestion.data.message)
    // console.log(routesSuggestion.data.message.map((route_object) => route_object.route_id));
    setSuggestedRoutes(routesSuggestion.data.message.map((route_object) => route_object.route_id))
    console.log(suggestedRoutes)    
    // /api/routeManagement/activeTrips

    const vehicleSuggestion = await API.get("/routeManagement/activeTrips",{
      routeIds : suggestedRoutes
    })

    console.log(vehicleSuggestion.data)

  };

  return (
    <div className="p-6">
      <PassengerFormComponent sendData={handleSendData} />
    </div>
  );
}
