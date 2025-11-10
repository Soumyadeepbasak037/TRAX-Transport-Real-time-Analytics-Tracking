// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api.js";
// import RouteList from "../components/RouteList.jsx";
// import ActiveTripsCard from "../components/ActiveTripsCard.jsx";
import io from "socket.io-client";
import PassengerFormComponent from "../components/PassengerForm.jsx";



export default function PassengerPage() {
  const [suggestedRoutes,setSuggestedRoutes] = useState([])
  const [suggestedVehicles,setSuggestedVehicles] = useState([])

  const handleSendData = async({ srcStop, destStop }) => {
    console.log("Selected stops:", srcStop, destStop);

    const routesSuggestion = await API.post("/suggestion/singleHopSuggestion",{
      src_id: srcStop,
      dest_id: destStop,
    })
    console.log(routesSuggestion.data.message)
    // console.log(routesSuggestion.data.message.map((route_object) => route_object.route_id));
    
    const routeids = (routesSuggestion.data.message.map((route_object) => route_object.route_id))

    setSuggestedRoutes(routeids)

    console.log(`suggestedRouteId:${suggestedRoutes}`)
        
    // /api/routeManagement/activeTrips

    const vehicleSuggestion = await API.post("/routeManagement/activeTrips",{
      routeIds : routeids
    })

    console.log("Suggested Vehicle Data:", vehicleSuggestion.data);
    setSuggestedVehicles(vehicleSuggestion.data.message || []);
  };

  const handleSocket = async() =>{
    
  }





  return (
      <div className="p-6 space-y-6">
        <PassengerFormComponent sendData={handleSendData} />

        {/* ✅ Show suggested vehicles */}
        {suggestedVehicles.length > 0 && (
          <div className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3">
              🚐 Suggested Vehicles ({suggestedVehicles.length})
            </h2>

            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="py-2 px-3 border-b">Trip ID</th>
                  <th className="py-2 px-3 border-b">Route ID</th>
                  <th className="py-2 px-3 border-b">Vehicle No.</th>
                  <th className="py-2 px-3 border-b">Driver Name</th>
                  <th className="py-2 px-3 border-b">License</th>
                  <th className="py-2 px-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {suggestedVehicles.map((vehicle) => (
                  <tr key={vehicle.trip_id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border-b">{vehicle.trip_id}</td>
                    <td className="py-2 px-3 border-b">{vehicle.route_id}</td>
                    <td className="py-2 px-3 border-b">{vehicle.vehicle_number}</td>
                    <td className="py-2 px-3 border-b">{vehicle.full_name}</td>
                    <td className="py-2 px-3 border-b">{vehicle.license_number}</td>
                    <td className="py-2 px-3 border-b text-blue-600 font-medium">
                      {vehicle.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🚫 If no data yet */}
        {suggestedVehicles.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            No vehicle suggestions yet. Select stops to get routes.
          </p>
        )}
      </div>
    );
  }