const Plants_Admin = require("../../models/PlantsAdmin.model");
const queryConstructor = require("../../utils/query.construtor");

const searchPlants = async (req, res) => {
  try {
    const filters = req.body.filters;
    const query = queryConstructor(filters);
    //pagination logic

    const pageSize = 12;
    const pageNumber = parseInt(filters.page || "1");
    const skip = (pageNumber - 1) * pageSize;

    // / Query with pagination
    const plants = await Plants_Admin.find(query).skip(skip).limit(pageSize);
    const total = await Plants_Admin.countDocuments(query);
    res.json({
      plants,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching plants" });
  }
};

module.exports = {
  searchPlants,
};
