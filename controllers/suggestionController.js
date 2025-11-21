import Joi from "joi";
import {
  singleHopSuggestion,
  nearest_stop,
  availible_vehicle_with_routes,
} from "../dbLogic/vehicle_suggestion.js";

export const singlehopsuggestion = async (req, res) => {
  try {
    const { src_id, dest_id } = req.body;
    const result = await singleHopSuggestion(src_id, dest_id);
    // console.log("Result:", result);
    // console.log("Rows:", result.rows);
    return res.json({ success: true, message: result.rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};
export const nearestStopSuggestion = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const result = await nearest_stop(lat, lng);

    return res.json({
      success: true,
      message: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const Avalible_vehicles = async () => {
  try {
    const result = await availible_vehicle_with_routes();
    return res.json({
      success: true,
      message: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
