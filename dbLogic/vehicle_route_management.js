import db from "../config/db.js";
//CRUD OPS
export const getroutefromid = async (route_id) => {
  const query = `select * from route_stops where route_id = $1 order by stop_order`;
  const result = await db.query(query, [route_id]);
  return result.rows;
};
//--------------------------------------------------------
// console.log(await getroutefromid(1));
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

export const modifyRouteStops = async (
  route_id,
  stop_id,
  modification_type,
  stop_order = -1
) => {
  if (modification_type == "add") {
    const max_stop_order_query = `select count(stop_order)-1 as max_stop_order from route_stops group by route_id having route_id = $1`;
    const max_stop_order_query_result = await db.query(max_stop_order_query, [
      route_id,
    ]);
    const max_stop_order = max_stop_order_query_result.rows[0].max_stop_order;
    if (stop_order === -1) {
      try {
        console.log(`Max stop order: ${max_stop_order}`);

        const query = `INSERT INTO route_stops (route_id,stop_id,stop_order) VALUES ($1,$2,$3) RETURNING id`;
        const result = await db.query(query, [
          route_id,
          stop_id,
          max_stop_order + 1,
        ]);
        return { success: true, message: result.rows[0] };
      } catch (err) {
        return { success: false, message: err };
      }
    } else {
      //max_stop_order
      const update_query = `UPDATE route_stops SET `;
    }
  }
};
// console.log(await modifyRouteStops(5, 17, "add"));
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
    // -- select * from route_stops where route_id = 4

    // -- update route_stops set stop_order = stop_order + 1
    // -- where route_id = 4 and stop_order <= 3 and stop_order >= 2

    // with rev_route_stops as(
    // with req_route_stops as (
    // 	select * from route_stops
    // 	where route_id = 4 and stop_order>=2
    // )
    // select * from req_route_stops order by id desc
    // )

    // -- select * from rev_route_stops

    // update route_stops set stop_order = rev_route_stops.stop_order + 1
    // FROM rev_route_stops
    // where route_stops.id = rev_route_stops.id
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
