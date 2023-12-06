import bcrypt from "bcrypt";
import User from "../models/user-model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing-model.js";

export const test = (req, res) => {
  res.json({
    message: "This is from user controller files",
  });
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user has been signOut");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You only delete your own account"));
  }
  try {
    const deleteUserDb = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User Deleted Successfully");
    res.clearCookie("access_token");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id == req.params.id) {
    try {
      const userListing = await Listing.find({ userRef: req.params.id });
      return res.status(201).json(userListing);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listing"));
  }
};
