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
  "/addRoute",
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

router.post(
  "/activeTrips",
  auth_middleware,
  // roleMiddleware("admin", "driver", "passenger"),
  tripController.GetActiveTrips
);

router.get("/allRoutes", auth_middleware, routes_controller.getRoutes);

router.get("/allStops", auth_middleware, routes_controller.getallStops);

export default router;
