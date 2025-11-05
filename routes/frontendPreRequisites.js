import express from "express";
import * as routes_controller from "../controllers/routesController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleValidationMiddleware.js";
import * as tripController from "../controllers/tripController.js";
const router = express.Router();

router.post(
  "/driverDetails",
  auth_middleware,
  roleMiddleware("admin", "driver"),
  tripController.GetDriverDetails
);
