import { useEffect, useState } from "react";
import API from "../api.js";

export default function PassengerFormComponent({sendData}){
    // const [srcStop, setsrcStop] = useState(null)
    // const [destStop,setdestStop] = useState(null)

    const handleSubmit = async(e) =>{
        e.preventDefault()

        const formData = new FormData(e.target);
        const srcStop = formData.get("srcStop")
        const destStop = formData.get("destStop")

        if (srcStop === destStop) {
            alert("Source and destination cannot be the same!");
      return;
    }
        sendData({ srcStop, destStop });
    }





     return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-lg font-semibold mb-3">Passenger Trip Form</h2>

      <div className="mb-3">
        <label>Source Stop:</label>
        <input
          type="text"
          name="srcStop"
          placeholder="Enter source stop"
          required
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <div className="mb-3">
        <label>Destination Stop:</label>
        <input
          type="text"
          name="destStop"
          placeholder="Enter destination stop"
          required
          className="border px-2 py-1 w-full rounded"
        />
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


