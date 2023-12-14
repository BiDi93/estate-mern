import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createListing,
  updateListing,
  deleteListing,
} from "../controller/listing-controller.js";
import {
  getListingData,
  getListingsData,
} from "../controller/user-controller.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete-listing/:id", verifyToken, deleteListing);
listingRouter.post("/update-listing/:id", verifyToken, updateListing);
listingRouter.get("/get/:id", getListingData);
listingRouter.get("/get", getListingsData);

export default listingRouter;
