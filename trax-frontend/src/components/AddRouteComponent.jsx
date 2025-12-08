import { useEffect, useState } from "react";
import API from "../api.js";


//for admin dashboard

export default function AddRouteComponent({sendData}){ 
    const [stops,setStops] = useState([])
    const [stopLoading,setLoading] = useState(true)
    const [stopID_arr,setstopID_arr] = useState([])

    const [vehicleNumber, setVehicleNumber] = useState("");
    const [description, setDescription] = useState("");


    useEffect(()=>{ 
    
    const fetchStops = async()=>{
      try{
        const res = await API.get("/routeManagement/allStops");
        if (res.data.success && Array.isArray(res.data.message)) {
          setStops(res.data.message); 
        }
      }
       catch(err){
        console.log(err)
       }
       setLoading(false);
    }
    fetchStops()

    },[])

    
    const addbtnhandler = (stopID) => {
        setstopID_arr((prev) =>
            prev.includes(stopID) ? prev : [...prev, stopID] //if prev state includes the stopid keep as it is else modify -> to prevent duplicates
    );  
    };

    const submitHandler = async(e)=>{
        e.preventDefault()

        const payload = {
            vehicle_number: vehicleNumber,
            description: description,
            stops: stopID_arr,
        };


        
        try {
            const res = await API.post("/routeManagement/addRoute", payload);

            if (sendData) sendData(payload);

            
            console.log("Submitted", res.data);
            alert(res.data.data)
            
        } catch (err) {
            console.log(err);
        }
    };

        if (stopLoading) return <p>Loading...</p>;


     return (
  <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Route</h2>

    <div className="bg-white shadow rounded-xl p-6 border mb-10">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Route Details</h3>

      <form onSubmit={submitHandler} className="space-y-5">
        
        {/* Vehicle Number */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Vehicle Number
          </label>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="WB24D 3345"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short description of the route"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition"
        >
          Submit Route
        </button>
      </form>
    </div>

    {/* STOPS LIST */}
    <h3 className="text-xl font-bold mb-3 text-gray-800">Select Stops</h3>

    <div className="max-h-80 overflow-y-auto bg-white border rounded-xl shadow-sm p-4">
      <ul className="space-y-3">
        {stops.map((stop) => (
          <li
            key={stop.stop_id}
            className="flex justify-between items-center bg-gray-50 border rounded-lg p-3 hover:bg-gray-100 transition"
          >
            <span className="font-medium text-gray-700">
              {stop.stop_name} <span className="text-gray-500">(ID: {stop.stop_id})</span>
            </span>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg shadow transition"
              onClick={() => addbtnhandler(stop.stop_id)}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>

    <p className="mt-6 font-semibold text-gray-700">
      Selected Stop IDs:{" "}
      <span className="text-blue-600">{JSON.stringify(stopID_arr)}</span>
    </p>
  </div>
);
}
   