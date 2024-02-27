import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js"; // rename the file to userRouter
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json()); // to allow json data to be passed in the body of the request
app.use(cookieParser());

mongoose.connect(process.env.MONGO).then(() => {
  console.log("MongoDB connected");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter); // any request that starts with /api/user will be handled by userRouter
app.use("/api/auth", authRouter);

/* 

In Express.js, if an error is passed to the next() function like next(err), 
Express will skip all remaining non-error-handling middleware and route handlers,
and pass control to the next error-handling middleware in the stack.
An error-handling middleware is defined as a middleware function 
that takes four arguments: err, req, res, and next. 
Express recognizes it as an error-handling middleware due 
to this special signature.

*/
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
