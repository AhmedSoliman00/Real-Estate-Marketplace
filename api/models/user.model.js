import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // to record the time
);

const User = mongoose.model("User", userSchema); // it will create collection with name users (plural of User)
// const User = mongoose.model("User", userSchema, "myusers"); // it will create collection with name myusers
export default User;
