import React, { useState } from "react";
import axios from "axios";
import API from "../api";

export default function RegisterForm() {
  const [role, setRole] = useState(null);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    data.role = role; 


    // const res = await API.post("/routeManagement/activeTrips");
    //     if (res.data.success) {
    //       setTrips(res.data.message);
    //     }

    // let apiUrl = "http://localhost:3000/api/auth/register";

    try {
      const res = await API.post("/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      });
      alert(res.data.message || "Registration successful!");
      form.reset();
      setRole(null);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      {!role ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select your role</h2>
          <select
            onChange={handleRoleChange}
            className="w-full border p-2 rounded"
            defaultValue=""
          >
            <option value="" disabled>
              -- Choose Role --
            </option>
            <option value="admin">Admin</option>
            <option value="passenger">Passenger</option>
            <option value="driver">Driver</option>
          </select>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4 capitalize">
            {role} Registration
          </h2>

          {/* Common Fields */}
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="w-full border p-2 mb-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-2 rounded"
            required
          />

          {/* Driver-Specific Fields */}
          {role === "driver" && (
            <>
              <input
                name="vehicle_number"
                type="text"
                placeholder="Vehicle Number"
                className="w-full border p-2 mb-2 rounded"
                required
              />
              <input
                name="vehicle_plate_number"
                type="text"
                placeholder="Vehicle Plate Number"
                className="w-full border p-2 mb-2 rounded"
                required
              />
              <input
                name="vehicle_type"
                type="text"
                placeholder="Vehicle Type"
                className="w-full border p-2 mb-2 rounded"
                required
              />
              <input
                name="vehicle_capacity"
                type="number"
                placeholder="Vehicle Capacity"
                className="w-full border p-2 mb-2 rounded"
                required
              />
              <input
                name="driver_name"
                type="text"
                placeholder="Driver Name"
                className="w-full border p-2 mb-2 rounded"
                required
              />
              <input
                name="driver_license_no"
                type="text"
                placeholder="Driver License Number"
                className="w-full border p-2 mb-2 rounded"
                required
              />
              <input
                name="driver_phone"
                type="text"
                placeholder="Driver Phone"
                className="w-full border p-2 mb-2 rounded"
                required
              />
            </>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setRole(null)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
