const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getPlantsAdmin,
  createAdminPlant,
  deleteAdminPlant,
  updateAdminPlant,
} = require("../controllers/plantsAdmin/plantsAdmin.controller");
const {
  searchPlants,
} = require("../controllers/searchPlantsAdmin/searchPlants.controller");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Store images in a local "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 10MB per image
});

const router = express.Router();

router.get("/plants_admin", getPlantsAdmin);
router.post("/postInplants_admin", upload.array("imgs", 5), createAdminPlant); // Allow up to 10 images
router.put("/plants_admin/:id", upload.array("imgs", 5), updateAdminPlant);
router.delete("/plants_admin/:id", deleteAdminPlant);

router.post("/plants/search", searchPlants);

module.exports = router;
