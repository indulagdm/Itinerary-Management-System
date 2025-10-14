import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email is unique."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      //   required: [true, "User role is required."],
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
