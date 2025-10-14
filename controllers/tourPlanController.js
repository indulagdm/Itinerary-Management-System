import Package from "../models/packageModel.js";
import TourPlan from "../models/tourPlanModel.js";

export const createTourPlan = async (formData) => {
  try {
    const { package_id, day, destination } = formData;

    let convertedItemID = package_id;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      console.log(
        "Converting Package ID ObjectId to string:",
        convertedItemID.toHexString()
      );
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      console.log(
        "Converting Package ID buffer to ObjectId:",
        convertedItemID.buffer
      );
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      console.log("Extracting Package ID from object:", convertedItemID.itemID);
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    console.log(
      "Converted Package ID:",
      convertedItemID,
      typeof convertedItemID
    ); // Debug
    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error("Invalid Package ID: " + JSON.stringify(convertedItemID));
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Package ID is not found.");
    }

    const newTourPlan = new TourPlan({
      package_id: package_id,
      day: day,
      destination: destination,
    });

    if (!newTourPlan) {
      throw new Error("Tour plan create failed");
    }

    await newTourPlan.save();

    return { success: true, message: `Tour plan added.` };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const getTourPlan = async (package_id) => {
  try {
    let convertedItemID = package_id;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      console.log(
        "Converting Package ID ObjectId to string:",
        convertedItemID.toHexString()
      );
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      console.log(
        "Converting Package ID buffer to ObjectId:",
        convertedItemID.buffer
      );
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      console.log("Extracting Package ID from object:", convertedItemID.itemID);
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    console.log(
      "Converted Package ID:",
      convertedItemID,
      typeof convertedItemID
    ); // Debug
    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error("Invalid Package ID: " + JSON.stringify(convertedItemID));
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Package ID is not found.");
    }

    const packageExist = await Package.findOne({ _id: convertedItemID });

    if (!packageExist) {
      throw new Error("Package is not exist.");
    }

    const tourPlans = await TourPlan.find({
      package_id: convertedItemID,
    })
      .populate("package_id", "package_name")
      .lean();

    let tourPlanWithStringId;
    if (Array.isArray(tourPlans) && tourPlans.length > 0) {
      tourPlanWithStringId = tourPlans.map((tourPlan) => ({
        ...tourPlan,
        _id: tourPlan._id.toString(),
      }));
    } else {
      throw new Error("No tour plan added.");
    }

    return { success: true, data: tourPlanWithStringId };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const getTourPlans = async () => {
  try {
    const tourPlans = await TourPlan.find()
      .populate("package_id", "package_name")
      .lean();

    let tourPlanWithStringId;
    if (Array.isArray(tourPlans) && tourPlans.length > 0) {
      tourPlanWithStringId = tourPlans.map((tourPlan) => ({
        ...tourPlan,
        _id: tourPlan._id.toString(),
      }));
    } else {
      throw new Error("No tour plan found.");
    }

    return { success: true, data: tourPlanWithStringId };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const updateTourPlan = async (tour_plan_id, formData) => {
  try {
    const { package_id, day, destination } = formData;

    let convertedItemID = tour_plan_id;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      console.log(
        "Converting Tour Plan ID ObjectId to string:",
        convertedItemID.toHexString()
      );
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      console.log(
        "Converting Tour Plan ID buffer to ObjectId:",
        convertedItemID.buffer
      );
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      console.log(
        "Extracting Tour Plan ID from object:",
        convertedItemID.itemID
      );
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    console.log(
      "Converted Tour Plan ID:",
      convertedItemID,
      typeof convertedItemID
    ); // Debug
    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Tour Plan ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Tour Plan ID is not found.");
    }

    const tourPlanID = await TourPlan.findOne({ _id: convertedItemID });

    if (!tourPlanID) {
      throw new Error("Tour plan not found.");
    }

    if (!day) {
      throw new Error("Day is required.");
    }

    if (!destination) {
      throw new Error("Destination is required.");
    }

    const updateTourPlan = await TourPlan.findOneAndUpdate(
      { _id: convertedItemID },
      {
        package_id: package_id,
        day: day,
        destination: destination,
      },
      {
        new: true,
      }
    );

    if (!updateTourPlan) {
      throw new Error("Tour plan is update failed.");
    }

    return {
      success: true,
      message: `${tourPlanID.package_id.package_name} is updated.`,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const deleteTourPlan = async (tour_plan_id) => {
  try {
    let convertedItemID = tour_plan_id;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      console.log(
        "Converting Tour Plan ID ObjectId to string:",
        convertedItemID.toHexString()
      );
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      console.log(
        "Converting Tour Plan ID buffer to ObjectId:",
        convertedItemID.buffer
      );
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      console.log(
        "Extracting Tour Plan ID from object:",
        convertedItemID.itemID
      );
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    console.log(
      "Converted Tour Plan ID:",
      convertedItemID,
      typeof convertedItemID
    ); // Debug
    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Tour Plan ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Tour Plan ID is not found.");
    }

    const getTourPlan = await TourPlan.findOne({ _id: convertedItemID });
    if (!getTourPlan) {
      throw new Error("No tour plan found.");
    }

    const deleteTourPlan = await TourPlan.findOneAndDelete({
      _id: convertedItemID,
    });

    if (!deleteTourPlan) {
      throw new Error("Tour plan is deleted.");
    }

    return {
      success: true,
      message: `${getTourPlan.package_id.package_name} is tour plan deleted.`,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};
