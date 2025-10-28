// Get vehicle number
// Get route_id for this vehicle_number
//Insert a new trip
//Listen for driver's location updates
//Complete trip on disconnect

import db from "../config/db.js";

export const GetVehicleNumber = async (vehicle_id) => {
  const vehicleNumberQuery = `SELECT vehicle_number FROM vehicles WHERE vehicle_id = $1`;
  const vehicleResult = await db.query(vehicleNumberQuery, [socket.vehicleId]);
  if (vehicleResult.rows.length === 0) {
    console.error("Vehicle not found");
    return;
  }
  const vehicle_number = vehicleResult.rows[0].vehicle_number;

  // Get route_id for this vehicle_number
  const routeQuery = `SELECT route_id FROM routes WHERE vehicle_number = $1`;
  const routeResult = await db.query(routeQuery, [vehicle_number]);
  if (routeResult.rows.length === 0) {
    console.error("No route found for this vehicle");
    return;
  }
  const route_id = routeResult.rows[0].route_id;
};
