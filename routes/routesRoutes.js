import express from "express";
import * as routes_controller from "../controllers/routesController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleValidationMiddleware.js";
const router = express.Router();

console.log("Routes Controller:", routes_controller);
console.log("dasdssad:", roleMiddleware);
// add role validation from roleValidationmiddleware only drivers can add routes
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
  "/allRoutes",
  auth_middleware,
  roleMiddleware("admin"),
  routes_controller.getRoutes
);
export default router;
