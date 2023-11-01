import User from "../models/user-model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { username, password, email } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);
  const user1 = new User({ username, email, password: hashPassword });
  try {
    await user1.save();
    res.status(201).json("User Has Been Created Successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
