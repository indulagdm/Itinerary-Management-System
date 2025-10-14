import Package from "../models/packageModel.js";

const name_regex = /^[A-Za-z]+(?:[ -'][A-Za-z]+)*$^/;

const createPackage = async (formData) => {
  try {
    const { package_name } = formData;

    if (!package_name) {
      throw new Error("Package name is required.");
    }

    if (name_regex.test(package_name)) {
      throw new Error("Package name only contain letters.");
    }

    const existPackage = await Package.findOne({ package_name: package_name });

    if (existPackage) {
      throw new Error("Package name already exist.");
    }

    const newPackage = new Package({
      package_name: package_name,
    });

    if (!newPackage) {
      throw new Error("Package save failed.");
    }

    await newPackage.save();

    return {
      success: true,
      message: `${package_name} is created.`,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPackages = async () => {
  try {
    const packages = await Package.find().lean();

    if (!packages) {
      throw new Error("No packages exist.");
    }

    const packagesWithStringIds = packages.map((pack) => ({
      ...pack,
      _id: pack._id.toString(),
    }));

    return { success: true, data: packagesWithStringIds };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

const getPackageByID = async (req, res) => {
  try {
    const packageID = req.params.packageID;

    if (!packageID) {
      return res.status(400).json({ message: "Package id not found." });
    }

    const existPackage = await Package.findOne({ _id: packageID });

    if (existPackage) {
      return res
        .status(400)
        .json({ message: "Not package exist. according this id number." });
    }

    return res
      .status(200)
      .json({ message: "data fetched.", data: existPackage });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const packageID = req.params.packageID;

    if (!packageID) {
      return res.status(404).json({ message: "Package id is not found." });
    }

    const { package_name } = req.body;

    if (name_regex.test(package_name)) {
      return res
        .status(400)
        .json({ message: "Package name only contain letters." });
    }

    const existPackage = await Package.findOne({ _id: packageID });

    if (!existPackage) {
      return res
        .status(404)
        .json({ message: "Not exist package according this id." });
    }

    const updatePackage = await Package.findOneAndUpdate(
      { _id: packageID },
      { package_name: package_name },
      { new: true }
    );

    if (!updatePackage) {
      return res.status(400).json({ message: "package update failed." });
    }

    return res
      .status(200)
      .json({ message: "package updated.", data: updatePackage });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const packageID = req.params.packageID;

    if (!packageID) {
      return res.status(404).json({ message: "Package id is not found." });
    }

    const existPackage = await Package.findOne({ _id: packageID });

    if (!existPackage) {
      return res.status(404).json({ message: "Package not exist." });
    }

    const deletePackage = await Package.findOneAndDelete({ _id: packageID });

    if (!deletePackage) {
      return res.status(400).json({ message: "Package delete failed." });
    }

    return res.status(200).json({ message: "Package deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  createPackage,
  getPackages,
  getPackageByID,
  updatePackage,
  deletePackage,
};

// module.exports = { createPackage, getPackages };
