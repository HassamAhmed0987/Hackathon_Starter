import { Router } from "express";
import { changePassword, getMe, logout, userRegister, userlogin } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimitMiddlwware.js";


const router = Router()

router.post("/register", authLimiter, userRegister)
router.post("/login", authLimiter, userlogin)
router.post("/change-password", authLimiter, authenticate, changePassword)
router.get("/me", authLimiter, authenticate, getMe)
router.post("/logout", logout)


export default router