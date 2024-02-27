import express from "express";
import { test } from "../controllerss/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser } from "../controllerss/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);

export default router;
