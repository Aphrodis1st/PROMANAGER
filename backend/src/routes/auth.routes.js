import { Router } from "express";
import { register, login, me, refresh } from "../controllers/auth.controller.js";
import { login as unifiedLogin } from "../controllers/unifiedLogin.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/unified-login", unifiedLogin);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);

export default router;
