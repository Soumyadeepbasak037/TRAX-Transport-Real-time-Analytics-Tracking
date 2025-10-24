import db from "../config/db.js";

export const GetStopID = async (stopName_arr) => {
  try {
    const GetStopIdQuery = `SELECT stop_id FROM stops where stop_name = ANY($1)`;
    const result = await db.query(GetStopIdQuery, [stopName_arr]);
    const stopID_arr = result.rows.map((r) => r.stop_id);
    return stopID_arr;
  } catch (err) {
    return err;
  }
};

export const checkVehicle_No_Exists = async (vehicleNo) => {
  const query = `select * from  routes where vehicle_number = $1`;
  try {
    const result = await db.query(checkVehicle_No_Exists, [vehicleNo]);
    if (result.rows.length === 0) {
      return 1;
    } else {
      return 0;
    }
  } catch (err) {
    return err;
  }
};
export const addNewRoute = async (stopID_arr, vehicle_number, description) => {
  // check whether a route for the given vehicle_number exist already
  // -> if not insert the vehicle_nummber into the routes table with description and return the inserted route_ID
  // -> for each element in stopidarr insert returned routeID, respective stop_id, stop_order(from a counter variable) into route_stops table
  // -> return success

  const check_route_exists = checkVehicle_No_Exists(vehicle_number);
  if (checkVehicle_No_Exists) {
    try {
      await db.query("BEGIN"); // start transaction

      const insert_into_routes = `INSERT INTO routes (vehicle_number,description) VALUES ($1,$2) RETURNING route_id`;
      const insert_into_route_stops = `INSERT INTO route_stops (route_id,stop_id,stop_order) VALUES ($1,$2,$3)`;

      const route_query_result = await db.query(insert_into_routes, [
        vehicle_number,
        description,
      ]);
      const routeID = route_query_result.rows[0].route_id;
      console.log(`Inserted Route ID : ${routeID}`);

      for (let index = 0; index < stopID_arr.length; index++) {
        const stopID = stopID_arr[index];
        const routeStops_query_result = await db.query(
          insert_into_route_stops,
          [routeID, stopID, index]
        );
        console.log(`Stopid : ${stopID} , INDEX: ${index}`);
      }
      await client.query("COMMIT");
    } catch (err) {
      await db.query("ROLLBACK");
      console.error("Transaction failed:", err);
      throw err;
    }
  } else {
    return "Route for given vehicle number already exists";
  }
};

export const constructLineString = async () => {};

console.log(await GetStopID(["Howrah Station", "Esplanade"]));

await addNewRoute(
  await GetStopID(["Howrah Station", "Esplanade"]),
  "214A",
  "random ass bus"
);
