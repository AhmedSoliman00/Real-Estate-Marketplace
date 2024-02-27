import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "Hello from controller",
  });
};

export const updateUser = async (req, res, next) => {
  // compared the decoded user id from the token with the user id from the request
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update your own profile"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
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
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
