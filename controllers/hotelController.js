import Hotel from "../models/hotelModel";

export const createHotel = async (formData) => {
  try {
    const { tour_plan_id, hotel_name, hotel_type, hotel_link } = formData;

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

    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Tour Plan ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Tour Plan ID is not found.");
    }

    if (!hotel_name) {
      throw new Error("Hotel name is required.");
    }

    if (!hotel_type) {
      throw new Error("Hotel type is required.");
    }

    if (!hotel_link) {
      throw new Error("Hotel link is required.");
    }

    const newHotel = new Hotel({
      tour_plan_id: convertedItemID,
      hotel_name: hotel_name,
      hotel_type: hotel_type,
      hotel_link: hotel_link,
    });

    if (!newHotel) {
      throw new Error("Hotel creation failed.");
    }

    await newHotel.save();

    return { success: true, message: `${hotel_name} created.` };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const getHotels = async (tour_plan_id) => {
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

    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Tour Plan ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Tour Plan ID is not found.");
    }

    const hotels = await Hotel.find({ tour_plan_id: convertedItemID }).lean();

    let hotelsWithStringId;

    if (Array.isArray(hotels) && hotels.length > 0) {
      hotelsWithStringId = hotels.map((hotel) => ({
        ...hotel,
        _id: hotel._id.toString(),
      }));
    } else {
      throw new Error("No hotel found.");
    }

    return { success: true, data: hotelsWithStringId };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const getHotelAll = async () => {
  try {
    const hotels = await Hotel.find().lean();

    let hotelsWithStringId;

    if (Array.isArray(hotels) && hotels.length > 0) {
      hotelsWithStringId = hotels.map((hotel) => ({
        ...hotel,
        _id: hotel._id.toString(),
      }));
    } else {
      throw new Error("No hotel found.");
    }

    return { success: true, data: hotelsWithStringId };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const updateHotels = async (tour_plan_id, hotel_id, formData) => {
  try {
    let convertedItemID = tour_plan_id;
    let convertedHotelID = hotel_id;

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

    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Tour Plan ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Tour Plan ID is not found.");
    }

    if (typeof convertedHotelID === "object" && convertedHotelID.toHexString) {
      console.log(
        "Converting Hotel ID ObjectId to string:",
        convertedHotelID.toHexString()
      );
      convertedHotelID = convertedHotelID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedHotelID === "object" && convertedHotelID.buffer) {
      console.log(
        "Converting Hotel ID buffer to ObjectId:",
        convertedHotelID.buffer
      );
      convertedHotelID = new mongoose.Types.ObjectId(
        convertedHotelID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedHotelID === "object" && convertedHotelID.itemID) {
      console.log("Extracting Hotel ID from object:", convertedHotelID.itemID);
      convertedHotelID = convertedHotelID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedHotelID = String(convertedHotelID);

    if (!mongoose.isValidObjectId(convertedHotelID)) {
      throw new Error("Invalid Hotel ID: " + JSON.stringify(convertedHotelID));
    }

    if (!convertedHotelID) {
      // Check convertedItemID instead of itemID
      throw new Error("Hotel ID is not found.");
    }

    const { tour_plan_id, hotel_name, hotel_type, hotel_link } = formData;

    const updateHotel = await Hotel.findOneAndUpdate(
      { _id: convertedHotelID },
      {
        hotel_name: hotel_name,
        hotel_type: hotel_type,
        hotel_link: hotel_link,
      },
      { new: true }
    );

    if (!updateHotel) {
      throw new Error("Fail to update hotel.");
    }

    return { success: true, message: "Update completed." };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const deleteHotel = async (tour_plan_id, hotel_id) => {
  try {
    let convertedItemID = tour_plan_id;
    let convertedHotelID = hotel_id;

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

    if (!mongoose.isValidObjectId(convertedItemID)) {
      throw new Error(
        "Invalid Tour Plan ID: " + JSON.stringify(convertedItemID)
      );
    }

    if (!convertedItemID) {
      // Check convertedItemID instead of itemID
      throw new Error("Tour Plan ID is not found.");
    }

    if (typeof convertedHotelID === "object" && convertedHotelID.toHexString) {
      console.log(
        "Converting Hotel ID ObjectId to string:",
        convertedHotelID.toHexString()
      );
      convertedHotelID = convertedHotelID.toHexString();
    }
    // Handle Buffer
    else if (typeof convertedHotelID === "object" && convertedHotelID.buffer) {
      console.log(
        "Converting Hotel ID buffer to ObjectId:",
        convertedHotelID.buffer
      );
      convertedHotelID = new mongoose.Types.ObjectId(
        convertedHotelID.buffer
      ).toHexString();
    }
    // Handle plain object with itemID property
    else if (typeof convertedHotelID === "object" && convertedHotelID.itemID) {
      console.log("Extracting Hotel ID from object:", convertedHotelID.itemID);
      convertedHotelID = convertedHotelID.itemID; // Assign the string value
    }
    // Ensure it's a string
    convertedHotelID = String(convertedHotelID);

    if (!mongoose.isValidObjectId(convertedHotelID)) {
      throw new Error("Invalid Hotel ID: " + JSON.stringify(convertedHotelID));
    }

    if (!convertedHotelID) {
      // Check convertedItemID instead of itemID
      throw new Error("Hotel ID is not found.");
    }

    const deleteHotel = await Hotel.findOneAndDelete({ _id: convertedHotelID });

    if (!deleteHotel) {
      throw new Error("Fail to delete hotel.");
    }

    return { success: true, message: "Hotel deleted." };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};
