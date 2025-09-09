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
    const { vehicle_no, stop_name_array } = req.body;

    const get_stop_id_Query = `
      SELECT * 
      FROM stops 
      WHERE stop_id = ANY($1::int[])
    `;

    const result = await db.query(get_stop_id_Query, [stop_name_array]);

    const inserIntoRoutes = `INSERT INTO routes (vehicle_number,start_point,end_point) VALUES ($1,$2,$3)`;

    const insertResults = await db.query(inserIntoRoutes, [
      vehicle_no,
      stop_name_array[0],
      stop_name_array[stop_name_array.length - 1],
    ]);

    console.log(result);
    res.json({ message: Success });
  } catch (err) {
    res.json({ message: err });
  }
};

const manageRoutestable = async () => {};
