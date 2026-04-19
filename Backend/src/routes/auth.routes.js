import express from "express";
import { userRegister  , verifyEmail , userLogin  , getme} from "../controller/auth.controller.js";
import { registerUserRules } from "../validators/auth.validators.js";
import validate from "../validators/validate.middleware.js";
import { authMiddleware } from "../middelware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUserRules, validate, userRegister);
router.get('/verify-email' , verifyEmail)
router.post('/login' , userLogin)
router.get('/get-me' , authMiddleware , getme)

// /api/auth/verify-email

export default router;

