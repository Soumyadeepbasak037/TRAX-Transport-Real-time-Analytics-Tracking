import { getActiveTrips, getDriverDetails } from "../dbLogic/TripLogic.js";
export const GetActiveTrips = async (req, res) => {
  try {
    const { routeIds } = req.body || {};
    // console.log("Received route IDs:", routeIds);

    let result;
    if (Array.isArray(routeIds) && routeIds.length > 0) {
      result = await getActiveTrips(routeIds);
    } else {
      result = await getActiveTrips();
    }

    res.json({ success: true, message: result });
  } catch (err) {
    console.error("Error in GetActiveTrips:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// console.log(await getActiveTrips());
export const GetDriverDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await getDriverDetails(id);
    res.json({ success: true, message: result });
  } catch (err) {
    res.json({ success: false, message: err });
  }
};
