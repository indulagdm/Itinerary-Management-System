import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    tour_plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Tour plan id is required."],
      unique: [true, "Tour plan is unique for one hotel."],
    },
    hotel_name: {
      type: String,
      required: [true, "Hotel name is required."],
    },
    hotel_type: {
      type: String,
      required: [true, "Hotel type is required."],
    },
    hotel_link: {
      type: String,
      required: [true, "Hotel link is required."],
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("hotels", hotelSchema);

export default Hotel;
