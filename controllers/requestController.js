import Requested from "../models/requestedModel.js";

const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$^/;

const name_regex = /^[a-zA-Z]^/;

const mobile_regex = /^[0-9]{4,17}^/;

export const createRequested = async (formData) => {
  try {
    const {
      user_name,
      user_email,
      user_phone,
      user_country,
      check_in_date,
      no_of_days,
      no_of_adults,
      no_of_children,
      no_of_infant,
      hotel_type,
      flexible_days,
      any_requirements,
      vehicle_type,
      package_id,
      tour_id,
      status,
    } = formData;

    if (!user_name || !user_email || !user_phone) {
      throw new Error(
        "Requested user name, email and phone number is required."
      );
    }

    if (name_regex.test(user_name)) {
      throw new Error("Name only contain letters.");
    }

    if (email_regex.test(user_email)) {
      throw new Error("Email not in the correct order.");
    }

    if (mobile_regex.test(user_phone)) {
      throw new Error("Mobile number contain between 6-17 characters.");
    }

    if (no_of_days > 1) {
      throw new Error("No of days should be greater than 1 days.");
    }

    if (no_of_adults >= 1) {
      throw new Error("No of adults should be greater than 1.");
    }

    if (!package_id) {
      throw new Error("User should be choose package first.");
    }

    if (no_of_children || no_of_infant) {
      if (no_of_children > 0 || no_of_infant > 0) {
        throw new Error(
          "Children and infant should be grater than or equal 1."
        );
      }
    }

    const newRequested = new Requested({
      user_name: user_name,
      user_email: user_email,
      user_phone: user_phone,
      user_country: user_country,
      check_in_date: check_in_date,
      no_of_adults: no_of_adults,
      no_of_children: no_of_children,
      no_of_infant: no_of_infant,
      hotel_type: hotel_type,
      flexible_days: flexible_days,
      any_requirements: any_requirements,
      vehicle_type: vehicle_type,
      package_id: package_id,
      tour_id: tour_id,
      status: status,
    });

    if (!newRequested) {
      throw new Error("Error to save requested user details.");
    }

    await newRequested.save();

    return { success: true, message: `New requested data saved.` };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const getRequestedDetails = async () => {
  try {
    const requests = await Requested.find()
      .populate("package_id", "package_name")
      .lean();

    const requestedWithStringId = requests.map((request) => ({
      ...request,
      _id: request._id.toString(),
      package_id: request.package_id
        ? {
            ...requests.package_id.toObject(),
            _id: requests.package_id._id.toString(),
          }
        : null,
    }));

    if (!Array.isArray(requests) && !requests.length > 0) {
      throw new Error("No data found.");
    }

    return {
      success: true,
      data: requestedWithStringId,
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

export const getRequestedDetailByID = async (requestedID) => {
  try {
    let convertedItemID = requestedID;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      console.log(
        "Converting Requested ID ObjectId to string:",
        convertedItemID.toHexString()
      );
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      console.log(
        "Converting Requested ID buffer to ObjectId:",
        convertedItemID.buffer
      );
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      console.log("Extracting Requested from object:", convertedItemID.itemID);
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Requested ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      throw new Error("Requested id is not found.");
    }

    const requested = await Requested.findById(convertedItemID)
      .populate("package_id", "package_name")
      .lean();

    if (!requested) {
      throw new Error("No requested data found.");
    }

    if (requested._id) requested._id = requested._id.toString();
    if (item.package_id?._id)
      item.package_id._id = item.package_id._id.toString();

    return { data: requested, success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const updateRequested = async (requestedID, formData) => {
  try {
    let convertedItemID = requestedID;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      console.log(
        "Converting Requested ID ObjectId to string:",
        convertedItemID.toHexString()
      );
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      console.log(
        "Converting Requested ID buffer to ObjectId:",
        convertedItemID.buffer
      );
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      console.log(
        "Extracting Requested ID from object:",
        convertedItemID.itemID
      );
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    console.log(
      "Converted Requested ID:",
      convertedItemID,
      typeof convertedItemID
    ); // Debug
    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Requested ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Requested ID is not found.");
    }

    const request = await Requested.findById(convertedItemID)
      .populate("package_id", "package_name")
      .lean();

    if (!request) {
      throw new Error("No requested data found.");
    }

    if (request._id) request._id = request._id.toString();
    if (request.package_id?._id)
      request.package_id._id = item.package_id._id.toString();

    const {
      user_name,
      user_email,
      user_phone,
      user_country,
      check_in_date,
      no_of_days,
      no_of_adults,
      no_of_children,
      no_of_infant,
      hotel_type,
      flexible_days,
      any_requirements,
      vehicle_type,
      package_id,
      tour_id,
      status,
    } = formData;

    if (!user_name || !user_email || !user_phone) {
      throw new Error(
        "Requested user name, email and phone number is required."
      );
    }

    if (name_regex.test(user_name)) {
      throw new Error("Name only contain letters.");
    }

    if (email_regex.test(user_email)) {
      throw new Error("Email not in the correct order.");
    }

    if (mobile_regex.test(user_phone)) {
      throw new Error("Mobile number contain between 6-17 characters.");
    }

    if (no_of_days > 1) {
      throw new Error("No of days should be greater than 1 days.");
    }

    if (no_of_adults >= 1) {
      throw new Error("No of adults should be greater than 1.");
    }

    if (!package_id) {
      throw new Error("User should be choose package first.");
    }

    if (no_of_children || no_of_infant) {
      if (no_of_children > 0 || no_of_infant > 0) {
        throw new Error(
          "Children and infant should be grater than or equal 1."
        );
      }
    }

    const updatedRequest = await Requested.findOneAndUpdate(
      { _id: convertedItemID },
      {
        user_name: user_name,
        user_email: user_email,
        user_phone: user_phone,
        user_country: user_country,
        check_in_date: check_in_date,
        no_of_adults: no_of_adults,
        no_of_children: no_of_children,
        no_of_infant: no_of_infant,
        hotel_type: hotel_type,
        flexible_days: flexible_days,
        any_requirements: any_requirements,
        vehicle_type: vehicle_type,
        package_id: package_id,
        tour_id: tour_id,
        status: status,
      },
      { new: true }
    );

    if (!updateRequested) {
      throw new Error("Error to save requested user details.");
    }

    return {
      data: updateRequested,
      success: true,
      message: "Requested update save successful.",
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

export const deleteRequested = async(requestedID)=>{
    try{
        let convertedItemID = requestedID;

    // Handle Mongoose ObjectId
    if (typeof convertedItemID === "object" && convertedItemID.toHexString) {
      console.log(
        "Converting Requested ID ObjectId to string:",
        convertedItemID.toHexString()
      );
      convertedItemID = convertedItemID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedItemID === "object" && convertedItemID.buffer) {
      console.log(
        "Converting Requested ID buffer to ObjectId:",
        convertedItemID.buffer
      );
      convertedItemID = new mongoose.Types.ObjectId(
        convertedItemID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedItemID === "object" && convertedItemID.itemID) {
      console.log(
        "Extracting Requested ID from object:",
        convertedItemID.itemID
      );
      convertedItemID = convertedItemID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedItemID = String(convertedItemID);

    console.log(
      "Converted Requested ID:",
      convertedItemID,
      typeof convertedItemID
    ); // Debug
    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Requested ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Requested ID is not found.");
    }

    const request = await Requested.findById(convertedItemID)
      .populate("package_id", "package_name")
      .lean();

    if (!request) {
      throw new Error("No requested data found.");
    }

    if (request._id) request._id = request._id.toString();
    if (request.package_id?._id)
      request.package_id._id = item.package_id._id.toString();

    const deleteRequested = await Requested.findOneAndDelete({_id:convertedItemID});

    if(!deleteRequested){
        throw new Error("Requested data deleted failed.")
    }

    }catch(error){
        return {
            success:false,
            error:{
                message:error.message
            }
        }
    }
}
