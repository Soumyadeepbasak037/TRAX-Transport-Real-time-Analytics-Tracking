// import db from "../config/db.js";

// export const insertNewDriver = async (
//   user_id,
//   full_name,
//   license_number,
//   phone,
//   assigned_vehicle_id
// ) => {
//   try {
//     const insertQuery = `INSERT INTO drivers (user_id,full_name,license_number,phone,assigned_vehicle_id) VALUES ($1,$2,$3,$4,$5) RETURNING driver_id`;
//     const result = await db.query(insertQuery, [
//       user_id,
//       full_name,
//       license_number,
//       phone,
//       assigned_vehicle_id,
//     ]);
//     console.log(result);
//     return result.rows[0].driver_id;
//   } catch (err) {
//     return err;
//   }
// };
// export const insertNewVehicle = async (
//   vehicle_number,
//   type,
//   capacity,
//   vehicle_plate_number
// ) => {
//   try {
//     const insertQuery = `INSERT INTO vehicles (vehicle_number,type,capacity,vehicle_plate_number) VALUES ($1,$2,$3,$4) RETURNING vehicle_id`;
//     const result = await db.query(insertQuery, [
//       vehicle_number,
//       type,
//       capacity,
//       vehicle_plate_number,
//     ]);
//     console.log(result);
//     return result.rows[0].vehicle_id;
//   } catch (err) {
//     return err;
//   }
// };

import db from "../config/db.js";

export const insertNewDriver = async (
  user_id,
  full_name,
  license_number,
  phone,
  assigned_vehicle_id
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO drivers (user_id, full_name, license_number, phone, assigned_vehicle_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING driver_id
    `;

    const result = await client.query(insertQuery, [
      user_id,
      full_name,
      license_number,
      phone,
      assigned_vehicle_id,
    ]);

    await client.query("COMMIT");

    return result.rows[0].driver_id;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Driver insert failed:", err);
    throw err;
  } finally {
    client.release();
  }
};

export const insertNewVehicle = async (
  vehicle_number,
  type,
  capacity,
  vehicle_plate_number
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO vehicles (vehicle_number, type, capacity, vehicle_plate_number)
      VALUES ($1, $2, $3, $4)
      RETURNING vehicle_id
    `;

    const result = await client.query(insertQuery, [
      vehicle_number,
      type,
      capacity,
      vehicle_plate_number,
    ]);

    await client.query("COMMIT");

    return result.rows[0].vehicle_id;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Vehicle insert failed:", err);
    throw err;
  } finally {
    client.release();
  }
};
