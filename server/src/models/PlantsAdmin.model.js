const mongoose = require("mongoose");

const plantAdminSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPercentage: { type: Number },
    markedPrice: { type: Number },
    quantity: { type: Number, required: true },
    reviewsCount: { type: Number },
    rating: { type: Number },
    featured: { type: Boolean },
    popular: { type: Boolean },
    size: [{ type: String }],
    sunlightRequirement: { type: String },
    waterFrequency: { type: String },
    waterFrequencyDescription: [{ type: String }],
    replacementAvailable: { type: Boolean },
    expertGuidance: { type: Boolean },
    preOrderStatus: { type: Boolean },
    place: { type: String },
    growthRate: { type: String },
    benefits: [{ type: String }],
    imgs: [{ type: String, required: true }],
    nutritionalNeeds: [{ type: String }],
    seasonalAvailability: { type: String },
    propagationMethod: [{ type: String }],
    pestResistance: { type: String },
    toxicityLevel: { type: String },
    tag: { type: String },
    plantTags: [{ type: String }],
    promotionTags: { type: String },
    plantAccessories: [{ type: String }],
    category: { type: String },
    plantCare: [{ type: String }],
  },
  { timestamps: true }
);

const Plants_Admin = mongoose.model(
  "Plants_Admin",
  plantAdminSchema,
  "Plants_Admin"
);

module.exports = Plants_Admin;
