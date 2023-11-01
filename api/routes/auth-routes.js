import express from "express";
import { signup } from "../controller/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);

export default authRouter;
