import express from "express";
// import * as routes_controller from "../controllers/routesController.js";
import { singlehopsuggestion } from "../controllers/suggestionController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
import { nearestStopSuggestion } from "../controllers/suggestionController.js";
// import roleMiddleware from "../middlewares/roleValidationMiddleware.js";
const router = express.Router();

router.post("/singleHopSuggestion", auth_middleware, singlehopsuggestion);
router.post("/nearestStop", auth_middleware, nearestStopSuggestion);
export default router;
