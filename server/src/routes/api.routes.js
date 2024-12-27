const express = require("express");
const {
  getPlantsAdmin,
  createAdminPlant,
  deleteAdminPlant,
  updateAdminPlant,
} = require("../controllers/plantsAdmin/plantsAdmin.controller");
const {
  searchPlants,
} = require("../controllers/searchPlantsAdmin/searchPlants.controller");

const router = express.Router();

router.get("/plants_admin", getPlantsAdmin);
router.post("/postInplants_admin", createAdminPlant);
router.put("/plants_admin/:id", updateAdminPlant);
router.delete("/plants_admin/:id", deleteAdminPlant);

router.post("/plants/search", searchPlants);

module.exports = router;
