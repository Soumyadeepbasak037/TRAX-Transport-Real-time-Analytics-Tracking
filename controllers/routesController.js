import Joi from "joi";
import {
  insertStops,
  GetStopID,
  addNewRoute,
  constructLinestring,
  modifyRouteStops,
  getAllRoutes,
} from "../dbLogic/vehicle_route_management.js";

//schema

const stopSchema = Joi.object({
  stopname: Joi.string().min(2).required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
});

// {
//   "stops": [
//     {
//       "stopname": "Howrah Station",
//       "latitude": 22.5855,
//       "longitude": 88.3426
//     },
//     {
//       "stopname": "Esplanade",
//       "latitude": 22.5645,
//       "longitude": 88.3507
//     },
//     {
//       "stopname": "Sealdah",
//       "latitude": 22.5667,
//       "longitude": 88.3697
//     }
//   ]
// }

const insertStopsSchema = Joi.object({
  stops: Joi.array().items(stopSchema).min(1).required(),
});

const createRouteSchema = Joi.object({
  stopNames: Joi.array().items(Joi.string().min(2)).min(2).required(),
  vehicle_number: Joi.string().alphanum().min(2).required(),
  description: Joi.string().allow("").optional(),
});

// POST /api/stops
export const createStops = async (req, res) => {
  try {
    const { error, value } = insertStopsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const stopIds = await insertStops(value.stops);
    res.status(201).json({
      success: true,
      message: "Stops inserted successfully",
      stop_ids: stopIds,
    });
  } catch (err) {
    console.error("Error in createStops:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while inserting stops",
    });
  }
};

// POST /api/routes
export const createRoute = async (req, res) => {
  try {
    const { error, value } = createRouteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const { stopNames, vehicle_number, description } = value;

    const stopIds = await GetStopID(stopNames);
    if (stopIds.length !== stopNames.length) {
      return res.status(404).json({
        success: false,
        message: "Some stop names were not found in the database",
      });
    }

    const result = await addNewRoute(stopIds, vehicle_number, description);
    res.status(201).json({
      success: true,
      message: result,
    });
  } catch (err) {
    console.error("Error in createRoute:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while creating route",
    });
  }
};

// GET /api/routes/:id/linestring
export const getRouteLinestring = async (req, res) => {
  try {
    const idSchema = Joi.number().integer().positive().required();
    const { error } = idSchema.validate(req.params.id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid route ID",
      });
    }

    const routeData = await constructLinestring(req.params.id);
    if (!routeData) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      route: routeData,
    });
  } catch (err) {
    console.error("Error in getRouteLinestring:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while generating linestring",
    });
  }
};

export const updateRouteStops = async (req, res) => {
  const { route_id, stop_id, modification_type, stop_order } = req.body;
  let resp = null;
  if (stop_order != null) {
    resp = await modifyRouteStops(
      route_id,
      stop_id,
      modification_type,
      stop_order
    );
  } else {
    resp = await modifyRouteStops(route_id, stop_id, modification_type);
  }
  return res.json({ success: resp.success, message: resp.message });
};

export const getRoutes = async (req, res) => {
  try {
    const result = await getAllRoutes();
    res.json({ success: true, message: result });
  } catch (err) {
    res.json({ success: false, message: err });
  }
};
