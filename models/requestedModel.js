import mongoose from "mongoose";

const requestedSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, "User name is required."],
    },
    user_email: {
      type: String,
      required: [true, "User email is required."],
    },
    user_phone: {
      type: String,
      required: [true, "Mobile number is required."],
    },
    user_country: {
      type: String,
      required: [true, "Country is required."],
    },
    check_in_date: {
      type: Date,
      required: [true, "Checking date is required."],
    },
    no_of_days: {
      type: Number,
      required: [true, "No of days on stay is required."],
    },
    no_of_adult: {
      type: Number,
      required: [true, "No of adult is required."],
    },
    no_of_children: {
      type: Number,
    },
    no_of_infant: {
      type: Number,
    },
    hotel_type: {
      type: String,
      enum: ["3 Star", "4 Star", "5 Star", "Luxury Boutique"],
    },
    flexible_days: {
      type: Boolean,
      required: [true, "Select if you can arrange flexible days."],
    },
    any_requirements: {
      type: String,
    },
    vehicle_type: {
      type: String,
      enum: ["Car", "Van", "Bus"],
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Package selection is mandatory."],
    },
    tour_id: {
      type: String,
      required: [true, "Tour id is required."],
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
    },
  },
  { timestamps: true }
);

const Requested = mongoose.model("requests",requestedSchema);

export default Requested;
