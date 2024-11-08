import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../validations/userValidation.js";

const router = express.Router();

router.post("/register", validateRegistration, handleValidationErrors, register);
router.post("/login", validateLogin, handleValidationErrors, login);

export default router;
