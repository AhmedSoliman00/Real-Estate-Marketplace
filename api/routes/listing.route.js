import express from "express";
import { createListing,updateListing } from "../controllerss/createListing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create",verifyToken ,createListing);
router.put("/update/:id",verifyToken ,updateListing);

export default router;
