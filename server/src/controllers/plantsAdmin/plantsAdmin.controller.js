const Plants_Admin = require("../../models/PlantsAdmin.model");
const cloudinary = require("cloudinary");
const fs = require("fs");

// Get Plants Admin
const getPlantsAdmin = async (req, res) => {
  try {
    const { _id } = req.body;
    if (_id) {
      const plant = await Plants_Admin.findById(_id);
      console.log(plant);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      return res.json(plant);
    }
    const plants = await Plants_Admin.find(); // Fetch all plants
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ message: "Error retrieving plants", error });
  }
};

// Create a new plant
const createAdminPlant = async (req, res) => {
  try {
    const plantData = req.body;
    const { title, sizeDetails } = plantData;
    // Ensure title and imgs files are provided
    if (!title) {
      return res.status(400).json({ message: "Plant title is required" });
    }
    if (typeof plantData.sizeDetails === "string") {
      plantData.sizeDetails = JSON.parse(plantData.sizeDetails);
    }
    if (
      !sizeDetails ||
      !Array.isArray(plantData.sizeDetails) ||
      !plantData.sizeDetails.length
    ) {
      return res.status(400).json({ message: "Size details are required" });
    }
    // Ensure images are provided
    if (!req.files || !req.files.length) {
      // Checking for files array length
      return res.status(400).json({ message: "Plant image is required" });
    }

    const images = req.files;
    const imageUrls = [];
    // Upload each image
    for (const image of images) {
      const result = await cloudinary.v2.uploader.upload(image.path, {
        folder: `PlantsAdmin/${title}`, // Fixed folder path
        public_id: `${image.originalname.split(".")[0]}_${Date.now()}`,
        use_filename: true,
        unique_filename: false, // Use the original file name
      });
      imageUrls.push(result.secure_url);
      // Optionally delete the file after uploading
      fs.unlinkSync(image.path);
    }
    // Add image URLs to the plant data
    plantData.imgs = imageUrls;
    // Save plant data to the database
    const newPlant = new Plants_Admin(plantData);
    const savedPlant = await newPlant.save();
    res
      .status(201)
      .json({ message: "Plant created successfully:", plant: savedPlant });
  } catch (error) {
    console.error("Error creating plant:", error);
    res.status(500).json({ message: "Error creating plant", error });
  }
};

// Update a plant by ID
const updateAdminPlant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Check if images are provided
    if (req.files && req.files.length > 0) {
      const images = req.files;
      const imageUrls = [];
      // Upload each image to Cloudinary
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image.path, {
          folder: `PlantsAdmin/${updateData.title || "Untitled"}`,
          use_filename: true,
          unique_filename: false,
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(image.path); // Remove local file
      }
      // Add uploaded image URLs to updateData
      updateData.imgs = imageUrls;
    }
    console.log("Update Data:", updateData);
    // Update the plant in the database
    const updatedPlant = await Plants_Admin.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the updated data adheres to schema validation
    });
    console.log("Updated Plant:", updatedPlant);
    if (!updatedPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.status(200).json({
      message: "Plant updated successfully",
      plant: updatedPlant,
    });
  } catch (error) {
    console.error("Error updating plant:", error);
    res.status(500).json({ message: "Error updating plant", error });
  }
};

// Delete a plant by ID
const deleteAdminPlant = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters
    // Attempt to find and delete the plant by ID
    const deletedPlant = await Plants_Admin.findByIdAndDelete(id);
    // If no plant is found, return a 404 error
    if (!deletedPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    // Return success message along with deleted plant details
    res
      .status(200)
      .json({ message: "Plant deleted successfully", plant: deletedPlant });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ message: "Error deleting plant", error });
  }
};

module.exports = {
  getPlantsAdmin,
  createAdminPlant,
  deleteAdminPlant,
  updateAdminPlant,
};
