import db from "../config/db.js";

export const singleHopSuggestion = async (srcStopID, destStopID) => {
  const suggestion_query = `SELECT rs.route_id
                            FROM route_stops rs
                            JOIN route_stops rd ON rs.route_id = rd.route_id
                            WHERE rs.stop_id = $1
                            AND rd.stop_id = $2
                            AND rs.stop_order < rd.stop_order;`;
  try {
    const result = await db.query(suggestion_query, [srcStopID, destStopID]);
    console.log(result.rows);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const multiHopSuggestion = async () => {};

// await singleHopSuggestion();
