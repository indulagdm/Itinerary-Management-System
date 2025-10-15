import mongoose from "mongoose";

const tourPlanSchema = new mongoose.Schema(
  {
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Package selection is mandatory."],
      unique: [true, "Tour id is only contain one package id."],
    },
    day: {
      type: Number,
      required: [true, "Day is required."],
    },
    destination: {
      type: String,
      required: [true, "Destination is required."],
    },
    imagePaths: {
      type: [String],
    }
  },
  {
    timestamps: true,
  }
);

const TourPlan = mongoose.model("tourPlans", tourPlanSchema);

export default TourPlan;
