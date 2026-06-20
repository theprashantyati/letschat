// import express from "express";
// import { checkAuth } from "../controllers/auth.controller.js";
// import { protectRoute } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.get("/check", protectRoute, checkAuth);

// export default router;

import express from "express";
import { checkAuth, createOrUpdateUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", protectRoute, checkAuth);
router.post("/sync-user", protectRoute, createOrUpdateUser);

export default router;