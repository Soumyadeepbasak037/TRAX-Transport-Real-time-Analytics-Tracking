import express from "express";
import * as routes_controller from "../controllers/routesController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleValidationMiddleware.js";
import * as tripController from "../controllers/tripController.js";
const router = express.Router();

router.post(
  "/insertStops",
  auth_middleware,
  roleMiddleware("admin"),
  routes_controller.createStops
);

router.post(
  "/insertRouteStops",
  auth_middleware,
  roleMiddleware("admin"),
  routes_controller.createRoute
);

router.post(
  "/updateRouteStops",
  auth_middleware,
  roleMiddleware("admin"),
  routes_controller.updateRouteStops
);

router.get(
  "/activeTrips",
  auth_middleware,
  roleMiddleware("admin"),
  tripController.GetActiveTrips
);

router.get("/allRoutes", auth_middleware, routes_controller.getRoutes);
export default router;
