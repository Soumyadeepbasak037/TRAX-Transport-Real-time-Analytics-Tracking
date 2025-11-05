import db from "../config/db.js";

export const getActiveTrips = async () => {
  const query = `select tr.trip_id,tr.route_id,tr.vehicle_id,tr.status,v.vehicle_number,d.driver_id,d.user_id,d.full_name,d.license_number  from trips tr inner join vehicles v on tr.vehicle_id = v.vehicle_id inner join drivers d on v.vehicle_id = d.assigned_vehicle_id order by tr.trip_id desc`;
  const result = await db.query(query);
  console.log(result.rows);
  return result.rows;
};

export const getDriverDetails = async (driverID) => {
  const query = `SELECT * FROM drivers WHERE driver_id = $1`;
  const result = await db.query(query, [driverID]);
  console.log(result.rows);
  return result.rows;
};
// await getDriverDetails(1);
