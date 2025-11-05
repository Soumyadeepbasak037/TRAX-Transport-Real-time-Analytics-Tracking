import { getActiveTrips } from "../dbLogic/TripLogic.js";
export const GetActiveTrips = async (req, res) => {
  try {
    const result = await getActiveTrips();
    res.json({ success: true, message: result });
  } catch (err) {
    res.json({ success: false, message: err });
  }
};
