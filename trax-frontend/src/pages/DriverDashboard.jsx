import { useEffect, useState } from "react";
import API from "../api.js";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";


// const socket = io("http://localhost:3000", {
//     auth: { token: localStorage.getItem('token') },
// });


export default function DriverDashboard(){
    
    
    const [driverDetails, setDriverDetails] = useState({});
    const [token,setToken] = useState(null)
    const [decoded,setDecoded] = useState(null)


    useEffect(()=>{
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        setToken(storedToken)
        const decodedToken = jwtDecode(storedToken)
        setDecoded(decodedToken)        
        
        const fetchDriverDetails = async()=>{
            try{
                const res = await API.post("/essentials/driverDetails",{
                    id : decodedToken.driver_id
                })
   
                setDriverDetails(res.data.message[0]);
                console.log(res.data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchDriverDetails();
    },[])

  
  if (!driverDetails.full_name) {
    return (
      <div className="p-6 text-lg font-medium text-gray-600">Loading driver details...</div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Driver Dashboard</h1>
      <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">{driverDetails.full_name}</h2>
        <p><span className="font-medium">Driver ID:</span> {driverDetails.driver_id}</p>
        <p><span className="font-medium">License No:</span> {driverDetails.license_number}</p>
        <p><span className="font-medium">Phone:</span> {driverDetails.phone}</p>
        <p><span className="font-medium">Assigned Vehicle ID:</span> {driverDetails.assigned_vehicle_id}</p>
        <p className="text-sm text-gray-500 mt-2">
          Joined on: {new Date(driverDetails.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
