import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

const app = express();
app.use(express.json()); // to allow json data to be passed in the body of the request

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB connected");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter); // check in the user router file
app.use("/api/auth", authRouter); // check in the auth router file

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
