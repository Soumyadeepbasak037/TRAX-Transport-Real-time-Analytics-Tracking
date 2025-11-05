import express from "express";
import * as authController from "../controllers/authController.js";
import auth_middleware from "../middlewares/authMiddleware.js";
import router from "./routesRoutes.js";

router.post("/register", authController.register);

router.post("/login", authController.login);

export default router;
