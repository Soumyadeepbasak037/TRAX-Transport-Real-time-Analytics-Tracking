import db from "../config/db.js";

export const insertStops = async (stops_arr) => {
  try {
    let inserted_stops_id_arr = [];
    // stops_arr structure => [{stopname:,longitude:,lat:},{stopname:,longitude:,lat:},{stopname:,longitude:,lat:}] array of objects
    //const stops = JSON.parse(jsonData);
    const insertIntoStopsQuery = `INSERT INTO STOPS (stop_name,location) VALUES ($1,
                          ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography)
                          RETURNING stop_id`;

    let response_str = "";
    for (const stop of stops_arr) {
      const result = await db.query(insertIntoStopsQuery, [
        stop.stopname,
        stop.longitude,
        stop.latitude,
      ]);
      response_str += `${stop.stopname}(id=${result.rows[0].stop_id})`;
      inserted_stops_id_arr.push(result.rows[0].stop_id);
      console.log(response_str);
    }
    return inserted_stops_id_arr;
  } catch (err) {
    return err;
  }
};

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
    const result = await db.query(query, [vehicleNo]);
    if (result.rows.length === 0) {
      return 1;
    } else {
      return 0;
    }
  } catch (err) {
    return err;
  }
};
// export const addNewRoute = async (stopID_arr, vehicle_number, description) => {
//   // check whether a route for the given vehicle_number exist already
//   // -> if not insert the vehicle_nummber into the routes table with description and return the inserted route_ID
//   // -> for each element in stopidarr insert returned routeID, respective stop_id, stop_order(from a counter variable) into route_stops table
//   // -> return success

//   const check_route_exists = checkVehicle_No_Exists(vehicle_number);
//   if (checkVehicle_No_Exists) {
//     try {
//       await db.query("BEGIN"); // start transaction

//       const insert_into_routes = `INSERT INTO routes (vehicle_number,description) VALUES ($1,$2) RETURNING route_id`;
//       const insert_into_route_stops = `INSERT INTO route_stops (route_id,stop_id,stop_order) VALUES ($1,$2,$3)`;

//       const route_query_result = await db.query(insert_into_routes, [
//         vehicle_number,
//         description,
//       ]);
//       const routeID = route_query_result.rows[0].route_id;
//       console.log(`Inserted Route ID : ${routeID}`);

//       for (let index = 0; index < stopID_arr.length; index++) {
//         const stopID = stopID_arr[index];
//         const routeStops_query_result = await db.query(
//           insert_into_route_stops,
//           [routeID, stopID, index]
//         );
//         console.log(`Stopid : ${stopID} , INDEX: ${index}`);
//       }
//       await client.query("COMMIT");
//     } catch (err) {
//       await db.query("ROLLBACK");
//       console.error("Transaction failed:", err);
//       throw err;
//     }
//   } else {
//     return "Route for given vehicle number already exists";
//   }
// };

// export const addNewRoute = async (stopID_arr, vehicle_number, description) => {
//   const check_route_exists = await checkVehicle_No_Exists(vehicle_number);

//   if (check_route_exists === 1) {
//     try {
//       await db.query("BEGIN"); // start transaction

//       const insert_into_routes = `
//         INSERT INTO routes (vehicle_number, description)
//         VALUES ($1, $2)
//         RETURNING route_id
//       `;
//       const insert_into_route_stops = `
//         INSERT INTO route_stops (route_id, stop_id, stop_order)
//         VALUES ($1, $2, $3)
//       `;

//       const route_query_result = await db.query(insert_into_routes, [
//         vehicle_number,
//         description,
//       ]);

//       const routeID = route_query_result.rows[0].route_id;
//       console.log(`Inserted Route ID: ${routeID}`);

//       for (let index = 0; index < stopID_arr.length; index++) {
//         const stopID = stopID_arr[index];
//         await db.query(insert_into_route_stops, [routeID, stopID, index]);
//         console.log(`Inserted stop ${stopID} at order ${index}`);
//       }

//       await db.query("COMMIT");
//       console.log("Transaction committed successfully");
//       return "New route added successfully.";
//     } catch (err) {
//       await db.query("ROLLBACK");
//       console.error("Transaction failed:", err);
//       throw err;
//     }
//   } else {
//     return "Route for given vehicle number already exists.";
//   }
// };

export const addNewRoute = async (stopID_arr, vehicle_number, description) => {
  const check_route_exists = await checkVehicle_No_Exists(vehicle_number);

  if (check_route_exists === 1) {
    const client = await db.connect(); // Get client from pool
    try {
      await client.query("BEGIN");

      const insert_into_routes = `
        INSERT INTO routes (vehicle_number, description)
        VALUES ($1, $2)
        RETURNING route_id
      `;

      const route_query_result = await client.query(insert_into_routes, [
        vehicle_number,
        description,
      ]);

      const routeID = route_query_result.rows[0].route_id;
      console.log(`Inserted Route ID: ${routeID}`);

      const insert_into_route_stops = `
        INSERT INTO route_stops (route_id, stop_id, stop_order)
        VALUES ($1, $2, $3)
      `;

      for (let index = 0; index < stopID_arr.length; index++) {
        const stopID = stopID_arr[index];
        await client.query(insert_into_route_stops, [routeID, stopID, index]);
        console.log(`Inserted stop ${stopID} at order ${index}`);
      }

      await client.query("COMMIT");
      console.log("Transaction committed successfully");
      return "New route added successfully.";
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Transaction failed:", err);
      throw err;
    } finally {
      client.release();
    }
  } else {
    return "Route for given vehicle number already exists.";
  }
};

export const constructLinestring = async (routeID) => {
  const query = `
    SELECT r.route_id,
           r.vehicle_number,
           ST_AsGeoJSON(
             ST_MakeLine(s.location::geometry ORDER BY rs.stop_order)
           ) AS route_line,
           ST_Length(
             ST_MakeLine(s.location::geometry ORDER BY rs.stop_order)::geography
           ) / 1000 AS distance_km
    FROM routes r
    JOIN route_stops rs ON r.route_id = rs.route_id
    JOIN stops s ON rs.stop_id = s.stop_id
    WHERE r.route_id = $1
    GROUP BY r.route_id, r.vehicle_number;
  `;

  const result = await db.query(query, [routeID]);
  console.log(result.rows[0]);
  return result.rows[0];
};

// console.log(await GetStopID(["Howrah Station", "Esplanade"]));

// await addNewRoute(
//   await GetStopID(["Howrah Station", "Esplanade"]),
//   "214A",
//   "random ass bus"
// );

//addnewroute method and its upporting methods working
