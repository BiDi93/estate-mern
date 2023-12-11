import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing } from "../controller/listing-controller.js";
import { deleteListing } from "../controller/listing-controller.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete-listing/:id", verifyToken, deleteListing);

export default listingRouter;
