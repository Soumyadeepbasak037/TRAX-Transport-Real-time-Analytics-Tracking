import Joi from "joi";
import { singleHopSuggestion } from "../dbLogic/vehicle_suggestion.js";

export const singlehopsuggestion = async (req, res) => {
  try {
    const { src_id, dest_id } = req.body;
    const result = await singleHopSuggestion(src_id, dest_id);
    console.log("Result:", result);
    console.log("Rows:", result.rows);
    return res.json({ success: true, message: result.rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error while inserting stops : ${err}`,
    });
  }
};
