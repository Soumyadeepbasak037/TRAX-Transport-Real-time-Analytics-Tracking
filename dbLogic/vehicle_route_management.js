import { getAdapter } from "axios";
import db from "../config/db.js";
// import { getallStops } from "../controllers/routesController.js";
//CRUD OPS

const Output_Modifier = (route_arr) => {
  // console.log(route_arr);

  const route_arr_modified = route_arr.reduce((accum, route) => {
    if (!accum[route.route_id]) {
      accum[route.route_id] = [];
    }
    accum[route.route_id].push(route);
    return accum;
  }, {});

  return route_arr_modified;
};

export const getAllRoutes = async () => {
  const query = `
          select rs.route_id,s.stop_name,rs.stop_order from route_stops rs inner join routes r on r.route_id = rs.route_id   
inner join stops s on rs.stop_id = s.stop_id order by route_id,stop_order asc`;

  const result = await db.query(query);
  // console.log(result.rows);
  return Output_Modifier(result.rows);
};
// console.log(await getAllRoutes());

export const getAllStops = async () => {
  try {
    const query = `select * from stops`;
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    return err;
  }
};

// console.log(await getAllStops());

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
    const max_stop_order_query = `select coalesce(max(stop_order), -1) as max_stop_order from route_stops group by route_id having route_id = $1`;
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
        return { success: true, message: result };
      } catch (err) {
        return { success: false, message: err };
      }
    } else {
      // -- select * from route_stops where route_id = 4
      // -- update route_stops set stop_order = stop_order + 1
      // -- where route_id = 4 and stop_order <= 3 and stop_order >= 2
      // -- new stop at route_id = 4 and stop_order = 2
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
      try {
        const shiftquery = `with rev_route_stops as(
                    with req_route_stops as (
                      select * from route_stops 
                      where route_id = $1 and stop_order>=$2
                    )
                    select * from req_route_stops order by id desc
                    )

                    -- select * from rev_route_stops

                    update route_stops set stop_order = rev_route_stops.stop_order + 1
                    FROM rev_route_stops
                    where route_stops.id = rev_route_stops.id 
                    returning id`;
        const shiftqueryresult = await db.query(shiftquery, [
          route_id,
          stop_order,
        ]);
        const insertQuery = `INSERT INTO route_stops (route_id,stop_id,stop_order) VALUES ($1,$2,$3)`;
        const insertresult = await db.query(insertQuery, [
          route_id,
          stop_id,
          stop_order,
        ]);
        return { success: true, message: insertresult };
      } catch (err) {
        return { success: false, message: err };
      }
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

export const checkRouteExists = async (vehicleNo) => {
  const normalized = vehicleNo.trim().toUpperCase();

  const result = await db.query(
    "SELECT 1 FROM routes WHERE TRIM(UPPER(vehicle_number)) = $1 LIMIT 1",
    [normalized]
  );

  return result.rows.length > 0;
};

export const addNewRoute = async (stopID_arr, vehicle_number, description) => {
  const routeExists = await checkRouteExists(vehicle_number);

  if (routeExists) {
    return "Route for given vehicle number already exists.";
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const insert_into_routes = `
      INSERT INTO routes (vehicle_number, description)
      VALUES ($1, $2)
      RETURNING route_id
    `;

    const route_result = await client.query(insert_into_routes, [
      vehicle_number.trim().toUpperCase(),
      description,
    ]);

    const routeID = route_result.rows[0].route_id;

    const insert_into_route_stops = `
      INSERT INTO route_stops (route_id, stop_id, stop_order)
      VALUES ($1, $2, $3)
    `;

    for (let i = 0; i < stopID_arr.length; i++) {
      await client.query(insert_into_route_stops, [routeID, stopID_arr[i], i]);
    }

    await client.query("COMMIT");
    return "New route added successfully.";
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
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
