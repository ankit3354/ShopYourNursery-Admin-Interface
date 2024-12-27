const Plants_Admin = require("../../models/PlantsAdmin.model");
const cloudinary = require("cloudinary");

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
    const { title } = plantData; // Ensure title is provided
    if (!title) {
      return res.status(400).json({ message: "Plant title is required" });
    }
    const imageUrls = [];
    if (req.files && req.files.imgs) {
      const images = Array.isArray(req.files.imgs)
        ? req.files.imgs
        : [req.files.imgs];
      // Upload each image to a Cloudinary folder named after the plant title
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: `Plants_Admin/${title}`, // Create a folder using the plant title
        });

        imageUrls.push(result.secure_url);
      }
    }
    // Add the image URLs to the plant data
    plantData.imgs = imageUrls;

    const newPlant = new Plants_Admin(plantData);
    const savedPlant = await newPlant.save();
    // console.log("Saved Plant:", savedPlant);
    res
      .status(201)
      .json({ message: "Plant created successfully", plant: savedPlant });
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
    const updatedPlant = await Plants_Admin.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the updated data adheres to schema validation
    });
    // If no plant is found, return a 404 error
    if (!updatedPlant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    // Return the updated plant
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
