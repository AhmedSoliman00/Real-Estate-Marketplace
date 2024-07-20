import express from "express";
import { createListing,updateListing,getListing } from "../controllerss/createListing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

router.post("/create",verifyToken ,createListing);
router.put("/update/:id",verifyToken ,updateListing);
router.get("/get-listing/:id" ,getListing);

export default router;
