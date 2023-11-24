import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserRouter from "./routes/user-routes.js";
import authRouter from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.mongoConnect)
  .then(() => {
    console.log("Connect to MONGODB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// in order to sent json object data in post method , need to declare below
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", UserRouter);
app.use("/api/auth", authRouter);

// error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
