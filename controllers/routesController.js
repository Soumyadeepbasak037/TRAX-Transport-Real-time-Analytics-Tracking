import db from "../config/db.js";

export const insertStops = async (req, res) => {
  try {
    const { jsonData } = req.body; //[{stopname:,longitude:,lat:},{stopname:,longitude:,lat:},{stopname:,longitude:,lat:}] array of objects
    //const stops = JSON.parse(jsonData);
    const stops = jsonData;
    const insertIntoStopsQuery = `INSERT INTO STOPS (stop_name,location) VALUES ($1,
                          ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography)
                          RETURNING stop_id`;

    let response_str = "";
    for (const stop of stops) {
      const result = await db.query(insertIntoStopsQuery, [
        stop.stopname,
        stop.longitude,
        stop.latitude,
      ]);
      response_str += ` ${stop.stopname}(id=${result.rows[0].stop_id})`;
    }
    res.json({
      message: `These stops were successfully inserted ${response_str}`,
    });
  } catch (err) {
    res.json({ message: err });
  }
};

export const insertRouteStops = async (req, res) => {
  try {
    /*
    {
     "vehicle_no": "WB19A1234",
    "stop_name_array": [1, 3, 5, 7, 9]
    }
    */
    const { vehicle_no, stop_id_array } = req.body;

    const get_stop_Query = `
      SELECT * 
      FROM stops 
      WHERE stop_id = ANY($1::int[])
    `;

    const result = await db.query(get_stop_Query, [stop_id_array]);

    const inserIntoRoutes = `INSERT INTO routes (vehicle_number) VALUES ($1) RETURNING routes_id`;

    const insertResults = await db.query(inserIntoRoutes, [vehicle_no]);

    console.log(insertResults);

    const insertedRowID = insertResults.rows[0].route_id;

    let stop_order = 0;
    const insertIntoRouteStops = `INSERT INTO route_stops (route_id,stop_id,stop_order) VALUES ($1,$2,$3)`;

    for (const stop of stop_id_array) {
      const route_id = insertedRowID;
      stop_id = stop_id_array[stop_order];
      const result = await db.query(insertIntoRouteStops, [
        route_id,
        stop_id,
        stop_order,
      ]);
      stop_order += 1;
    }
    res.json({ message: "Routes Managewd successfully" });
  } catch (err) {
    res.json({ message: err });
  }
};

const manageRoutestable = async () => {};
