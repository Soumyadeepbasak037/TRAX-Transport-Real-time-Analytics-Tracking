import db from "../config/db.js";

export const insertNewDriver = async (
  user_id,
  full_name,
  license_number,
  phone,
  assigned_vehicle_id
) => {
  try {
    const insertQuery = `INSERT INTO drivers (user_id,full_name,license_number,phone,assigned_vehicle_id) VALUES ($1,$2,$3,$4,$5) RETURNING driver_id`;
    const result = await db.query(insertQuery, [
      user_id,
      full_name,
      license_number,
      phone,
      assigned_vehicle_id,
    ]);
    console.log(result);
    return result.rows[0].driver_id;
  } catch (err) {
    return err;
  }
};
export const insertNewVehicle = async (vehicle_number, type, capacity) => {
  try {
    const insertQuery = `INSERT INTO vehicles (vehicle_number,type,capacity) VALUES ($1,$2,$3) RETURNING vehicle_id`;
    const result = await db.query(insertQuery, [
      vehicle_number,
      type,
      capacity,
    ]);
    console.log(result);
    return result.rows[0].vehicle_id;
  } catch (err) {
    return err;
  }
};
