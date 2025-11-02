import express from "express";
import * as routes_controller from "../controllers/routesController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
// import roleMiddleware from "../middlewares/roleValidationMiddleware.js";
const router = express.Router();

// add role validation from roleValidationmiddleware only drivers can add routes
router.post("/insertStops", auth_middleware, routes_controller.createStops);

router.post(
  "/insertRouteStops",
  auth_middleware,
  routes_controller.createRoute
);

export default router;
