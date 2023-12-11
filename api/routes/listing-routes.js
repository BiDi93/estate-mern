import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createListing,
  updateListing,
  deleteListing,
} from "../controller/listing-controller.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete-listing/:id", verifyToken, deleteListing);
listingRouter.post("/update-listing/:id", verifyToken, updateListing);

export default listingRouter;
