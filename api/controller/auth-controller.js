import User from "../models/user-model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);
  const user1 = new User({ username, email, password: hashPassword });
  try {
    await user1.save();
    res.status(201).json("User Has Been Created Successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUserMail = await User.findOne({ email });
    if (!validUserMail) return next(errorHandler(404, "User Not Found"));
    const validPassword = await bcrypt.compare(
      password,
      validUserMail.get("password")
    );
    if (validPassword === false) {
      return next(errorHandler(401, "Wrong Credentials"));
    }
    const token = jwt.sign({ id: validUserMail._id }, process.env.JWT_SECRET);
    // remove password from json response
    const { password: pass, ...rest } = validUserMail._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const userValid = await User.findOne({ email: req.body.email });
    if (userValid) {
      const userToken = jwt.sign({ id: userValid._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = userValid._doc;
      res
        .cookie("access_token", userToken, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const { name, email, photo } = req.body;
      const generateFakePassword = Math.random().toString(36).substring(2, 15);
      const hashFakePassword = bcrypt.hashSync(generateFakePassword, 10);

      const user2 = new User({
        username: name.split(" ").join("").toLowerCase(),
        email: email,
        password: hashFakePassword,
        avatar: photo,
      });

      await user2.save();
      const token = jwt.sign({ id: user2._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = userValid._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
