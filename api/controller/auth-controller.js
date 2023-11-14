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
