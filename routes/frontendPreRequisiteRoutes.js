import express from "express";
import * as routes_controller from "../controllers/routesController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleValidationMiddleware.js";
import * as tripController from "../controllers/tripController.js";
import { Avalible_vehicles } from "../controllers/suggestionController.js";

const router = express.Router();

router.post(
  "/driverDetails",
  auth_middleware,
  roleMiddleware("admin", "driver"),
  tripController.GetDriverDetails
);

router.get("/availibleVehiclesWithRoutes", auth_middleware, Avalible_vehicles);

export default router;
