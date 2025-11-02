import db from "../config/db.js";

export const getVehicleNumber = async (vehicleId) => {
  const query = `SELECT vehicle_number FROM vehicles WHERE vehicle_id = $1`;
  const result = await db.query(query, [vehicleId]);
  return result.rows[0]?.vehicle_number || null;
};

export const getRouteIdByVehicleNumber = async (vehicleNumber) => {
  const query = `SELECT route_id FROM routes WHERE vehicle_number = $1`;
  const result = await db.query(query, [vehicleNumber]);
  return result.rows[0]?.route_id || null;
};

export const startTrip = async (routeId, vehicleId) => {
  const query = `
    INSERT INTO trips (route_id, vehicle_id, start_time, status)
    VALUES ($1, $2, NOW(), 'ongoing')
    RETURNING trip_id
  `;
  const result = await db.query(query, [routeId, vehicleId]);
  return result.rows[0]?.trip_id || null;
};

export const registerSocket = async (socketID) => {
  const query = `INSERT INTO active_sockets (socketid) VALUES ($1) RETURNING id`;
  const result = await db.query(query, [socketID]);
  return result.rows[0].id;
};

export const add_passenger = async () => {};
export const insertVehiclePosition = async (
  vehicleId,
  tripId,
  lat,
  lng,
  speed,
  accuracy
) => {
  const query = `
    INSERT INTO vehicle_positions (vehicle_id, trip_id, location, speed_mps, accuracy)
    VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6)
  `;
  await db.query(query, [vehicleId, tripId, lng, lat, speed, accuracy]);
};

export const completeTrip = async (tripId) => {
  const query = `
    UPDATE trips
    SET status = 'completed', end_time = NOW()
    WHERE trip_id = $1
  `;
  await db.query(query, [tripId]);
};
