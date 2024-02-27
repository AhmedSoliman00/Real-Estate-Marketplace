import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // use UnderScore to access cookies

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  // token decoding will return the user object wich contain the id that we signed the token with
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Forbidden"));
    }
    req.user = user;
    next();
  });
};




