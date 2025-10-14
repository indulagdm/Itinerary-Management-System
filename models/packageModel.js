import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    package_name: {
      type: String,
      required: [true, "Package name is required."],
      unique: [true, "Package name already exist."],
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("packages", packageSchema);
export default Package;
