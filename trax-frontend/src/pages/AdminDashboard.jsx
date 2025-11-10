// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api.js";
import RouteList from "../components/RouteList.jsx";
import ActiveTripsCard from "../components/ActiveTripsCard.jsx";
import io from "socket.io-client";


export default function AdminDashboard() {
  const [groupedRoutes, setGroupedRoutes] = useState({});
  const [trips, setTrips] = useState([]);
  const [locationData, setLocationData] = useState(null);
  //local
  // const socket = io("http://localhost:3000", {
  //       auth: { token: localStorage.getItem('token') },
  //     });

  //remote
    //  const socket = io("https://trax-transport-real-time-analytics.onrender.com", {
    //         auth: { token: localStorage.getItem('token') },
    //     });

  useEffect(() => {
    console.log(localStorage.getItem('token'))
    const fetchRoutes = async () => {
      try {
        const res = await API.get("/routeManagement/allRoutes");
        if (res.data.success) {
          const grouped = {};
          res.data.message.forEach((r) => {
            if (!grouped[r.route_id]) grouped[r.route_id] = [];
            grouped[r.route_id].push(r);
          });
          setGroupedRoutes(grouped);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchActiveTrips = async () => {
      try {
        const res = await API.post("/routeManagement/activeTrips");
        if (res.data.success) {
          setTrips(res.data.message);
          console.log(res.data)
        }
      } catch (err) {
        console.log("Error fetching active trips:", err);
      }
    };

    fetchRoutes();
    fetchActiveTrips();
  }, []);

  const handleTrack = (vehicleId) => {
     //local
    const socket = io("http://localhost:3000", {
          auth: { token: localStorage.getItem('token') },
        });

  //remote
    //  const socket = io("https://trax-transport-real-time-analytics.onrender.com", {
    //         auth: { token: localStorage.getItem('token') },
    //     });

    console.log("Joining vehicle room:", vehicleId);
    socket.emit("passenger:join", { vehicleId });

    // Prevent duplicate listeners prevents event handler from fdiring
    socket.off("vehicleLocationUpdate");

    socket.on("vehicleLocationUpdate", (data) => {
      console.log("Vehicle Location Update:", data);
      setLocationData(data);
    });
  };

    return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* ROUTE SECTION */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          All Routes
        </h2>
        <RouteList groupedRoutes={groupedRoutes} />
      </section>

     {/* ACTIVE TRIPS SECTION */}
<section>
  <h2 className="text-xl font-bold mb-4 text-gray-800">Active Trips</h2>

  {trips.length > 0 ? (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-5xl mx-auto overflow-y-auto max-h-[400px]">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Trip ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Route ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Vehicle No.</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Driver Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">License</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip, index) => (
            <tr
              key={trip.trip_id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition`}
            >
              <td className="px-4 py-2 text-sm text-gray-700">{trip.trip_id}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{trip.route_id}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{trip.vehicle_number}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{trip.full_name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{trip.license_number}</td>
              <td
                className={`px-4 py-2 text-sm font-medium ${
                  trip.status === "ongoing"
                    ? "text-green-600"
                    : trip.status === "completed"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {trip.status}

              </td>
              
              <td className="px-4 py-2 text-right">
          
              {trip.status === "ongoing" &&( 
                <button
                  onClick={() => handleTrack(trip.vehicle_id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Check Location
                </button>
              )
                }
      </td>
      {/* <td className="px-4 py-2 text-right">
        {trip.status === "completed"&&(
          <td className="px-4 py-2 text-sm text-gray-700">Completed</td>
        )}
      </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-gray-600 text-center">No active trips currently.</p>
  )}
</section>
    {/*Location Display Section */}
      {locationData && (
        <div className="mt-6 bg-white shadow-sm rounded-xl p-4 border border-gray-200 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Vehicle Location</h3>
          <p className="text-gray-700 text-sm">Vehicle ID: {locationData.vehicleId}</p>
          <p className="text-gray-700 text-sm">Trip ID: {locationData.tripId}</p>
          <p className="text-gray-700 text-sm">Latitude: {locationData.lat}</p>
          <p className="text-gray-700 text-sm">Longitude: {locationData.lng}</p>
          <p className="text-gray-700 text-sm">Speed: {locationData.speed} m/s</p>
          <p className="text-gray-700 text-sm">Accuracy: ±{locationData.accuracy} m</p>
        </div>
      )}
</div>
  );
}
