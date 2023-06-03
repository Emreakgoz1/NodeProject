import express from "express";
import {
  getLoginController,
  postLoginController,
  getRegisterController,
  postRegisterController,
  logoutController,
} from "../controllers/auth.js";
import { authMiddleware } from "../middlewares/auth.js";
import { registerValidation } from "../validations/register-validation.js";
import { body } from "express-validator";
const router = express.Router();

router.get("/login", authMiddleware, getLoginController);
router.get("/logout", logoutController);
router.get("/register", authMiddleware, getRegisterController);
router.post("/login", authMiddleware, postLoginController);
router.post(
  "/register",
  authMiddleware,
  registerValidation(),
  postRegisterController
);
export default router;
