import Package from "../models/packageModel.js";
import TourPlan from "../models/tourPlanModel.js";
import { app } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const isPackaged = app.isPackaged;
const UPLOAD_DIR = isPackaged
  ? path.join(process.resourcesPath, "uploads")
  : path.join(__dirname, "uploads");

export const createTourPlan = async (formData) => {
  try {
    const { package_id, day, destination, imagePaths } = formData;

    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

    let savedPaths = [];

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

    for (const imagePath of imagePaths) {
      const filename = Date.now() + "-" + path.basename(imagePath);
      const dest = path.join(UPLOAD_DIR, filename);

      // Copy file to local uploads directory
      fs.copyFileSync(imagePath, dest);
      savedPaths.push(dest);
    }

    const newTourPlan = new TourPlan({
      package_id: package_id,
      day: day,
      destination: destination,
      imagePaths: savedPaths
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
        imagePaths: tourPlan.imagePaths.map((image) => `file://${image}`)
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
        imagePaths: tourPlan.imagePaths.map((image) => `file://${image}`)
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
    const { package_id, day, destination, newImagePaths, oldImagePaths = true } = formData;

    let updatedImagePaths = [];

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

    if (keepOldImages && Array.isArray(tourPlanID.imagePaths)) {
      updatedImagePaths = [...tourPlanID.imagePaths];
    } else {
      // if not keeping old, delete them
      for (const img of tourPlanID.imagePaths) {
        if (fs.existsSync(img)) fs.unlinkSync(img);
      }
    }

    if (Array.isArray(newImagePaths)) {
      for (const imagePath of newImagePaths) {
        const filename = Date.now() + "-" + path.basename(imagePath);
        const dest = path.join(UPLOAD_DIR, filename);
        fs.copyFileSync(imagePath, dest);
        updatedImagePaths.push(dest);
      }
    }

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
        imagePaths: updatedImagePaths
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
