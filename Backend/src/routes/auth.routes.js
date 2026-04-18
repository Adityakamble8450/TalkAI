import express from "express";
import { userRegister } from "../controller/auth.controller.js";
import { registerUserRules } from "../validators/auth.validators.js";
import validate from "../validators/validate.middleware.js";

const router = express.Router();

router.post("/register", registerUserRules, validate, userRegister);

export default router;

