import express from "express";
import * as routes_controller from "../controllers/routesController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleValidationMiddleware.js";
const router = express.Router();

router.post("/insertStops", auth_middleware, routes_controller.insertStops);
router.post(
  "/insertRouteStops",
  auth_middleware,
  routes_controller.insertRouteStops
);

export default router;
