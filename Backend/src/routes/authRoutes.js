import { Router } from "express";
import { changePassword, getMe, logout, userRegister, userlogin } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";


const router = Router()

router.post("/register", userRegister)
router.post("/login", userlogin)
router.post("/change-password", authenticate, changePassword)
router.get("/me", authenticate, getMe)
router.post("/logout", logout)


export default router