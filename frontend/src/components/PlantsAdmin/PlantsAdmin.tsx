import React, { useEffect, useState } from "react";
import { usePlantsAdminContext } from "@/contexts/PlantsAdminProvider";
import { useParams } from "react-router-dom";

function PlantsAdmin() {
  const { handleAddPlantsAdmin, handleUpdatePlantsAdmin, getPlantById } =
    usePlantsAdminContext(); // Access the context
  const { id } = useParams();

  const { addPlant } = handleAddPlantsAdmin;
  const initialFormData = {
    title: "",
    description: "",
    price: 0,
    discountPercentage: 0,
    markedPrice: 0,
    quantity: 0,
    reviewsCount: 0,
    rating: 0,
    featured: false,
    popular: false,
    size: "", // Change from [] to ""
    sunlightRequirement: "",
    waterFrequency: "",
    waterFrequencyDescription: "", // Change from [] to ""
    replacementAvailable: false,
    expertGuidance: false,
    preOrderStatus: false,
    place: "",
    growthRate: "",
    benefits: "", // Change from [] to ""
    imgs: [],
    nutritionalNeeds: "", // Change from [] to ""
    seasonalAvailability: "",
    propagationMethod: "", // Change from [] to ""
    pestResistance: "",
    toxicityLevel: "",
    tag: "",
    plantTags: "", // Change from [] to ""
    promotionTags: "",
    plantAccessories: "", // Change from [] to ""
    category: "",
    plantCare: "", // Change from [] to ""
  };
  const [formData, setFormData] =
    useState<Record<string, any>>(initialFormData);

  useEffect(() => {
    if (id) {
      const plant = getPlantById(id);
      if (plant) {
        setFormData(plant);
      }
    }
  }, [id, getPlantById]);

  const handleChange = (e: any) => {
    const { name, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "file"
          ? Array.from(files)
          : type === "checkbox"
          ? checked
          : e.target.value,
    }));
  };

  const handleArrayChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add New Plants
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted : ", formData);
    try {
      if (id) {
        await handleUpdatePlantsAdmin.mutate({
          id,
          updateData: formData,
        });
        console.log("Plant updated successfully!");
      } else {
        const newPlant = await addPlant(formData);
        console.log("Plant added successfully:", newPlant);
      }
      setFormData(initialFormData);
    } catch (error) {
      console.error("Failed to add plant:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 border-[1px] ">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-20">
        <h1 className="text-xl font-semibold text-[#7AA363] mb-8 text-center">
          {id ? "Edit Plant" : "Add New Plant"}
        </h1>
        {/* form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                required
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                required
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              />
            </div>
            {/* Discount Percentage */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Discount Percentage
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage || ""}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              />
            </div>
            {/* Marked Price */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Marked Price
              </label>
              <input
                type="number"
                name="markedPrice"
                value={formData.markedPrice || ""}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              />
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleChange}
                required
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              />
            </div>
            {/* Featured Dropdown */}
            <div className="">
              <label className="block text-lg font-medium text-gray-700">
                Featured
              </label>
              <select
                name="featured"
                value={formData.featured ? "true" : "false"}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            {/* Popular Dropdown */}
            <div className="">
              <label className="block text-lg font-medium text-gray-700">
                Popular
              </label>
              <select
                name="popular"
                value={formData?.popular ? "true" : "false"}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            {/* Size */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Size
              </label>
              <select
                name="size"
                value={formData?.size || ""}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            {/* Sunlight Requirement */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Sunlight Requirement
              </label>
              <select
                name="sunlightRequirement"
                value={formData?.sunlightRequirement || ""}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="partial-sun">Partial Sun / Partial Shade</option>
                <option value="full-sun">Full Sun</option>
                <option value="shade">Shade</option>
                <option value="indirect-light">Indirect Light</option>
                <option value="low-light">Low Light</option>
              </select>
            </div>
            {/* Water Frequency */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Water Frequency
              </label>
              <select
                name="waterFrequency"
                value={formData?.waterFrequency || ""}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="partial-sun">Partial Sun / Partial Shade</option>
                <option value="full-sun">Full Sun</option>
                <option value="shade">Shade</option>
                <option value="indirect-light">Indirect Light</option>
                <option value="low-light">Low Light</option>
              </select>
            </div>
            {/* Water Frequency Description */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Water Frequency Description
              </label>
              <select
                name="waterFrequencyDescription"
                value={formData?.waterFrequencyDescription || ""}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded w-full"
              >
                <option value="">Water Frequency Description</option>
                <option value="Water regularly, keeping the soil moist but not waterlogged. Let the topsoil dry slightly before watering again.">
                  Water regularly, keeping the soil moist but not waterlogged.
                  Let the topsoil dry slightly before watering again.
                </option>
                <option value="Keep the soil consistently moist, especially in high humidity conditions. Water regularly, but avoid letting the plant sit in standing water.">
                  Keep the soil consistently moist, especially in high humidity
                  conditions. Water regularly, but avoid letting the plant sit
                  in standing water.
                </option>
                <option value="Water deeply but infrequently, letting the soil dry out completely between waterings. Overwatering can cause root rot, so ensure the soil is well-drained.">
                  Water deeply but infrequently, letting the soil dry out
                  completely between waterings. Overwatering can cause root rot,
                  so ensure the soil is well-drained.
                </option>
                <option value="Water when the top 1-2 inches of soil feel dry. Keep the soil moist but never soggy, and ensure good drainage.">
                  Water when the top 1-2 inches of soil feel dry. Keep the soil
                  moist but never soggy, and ensure good drainage.
                </option>
                <option value="Water consistently, keeping the soil moist but not soggy. Allow the top 1-2 inches of soil to dry before watering again.">
                  Water consistently, keeping the soil moist but not soggy.
                  Allow the top 1-2 inches of soil to dry before watering again.
                </option>
                <option value="Water sparingly. Let the soil dry out completely before watering again. Succulent plants like Crassula prefer drier conditions.">
                  Water sparingly. Let the soil dry out completely before
                  watering again. Succulent plants like Crassula prefer drier
                  conditions.
                </option>
                <option value="Water regularly to keep the soil consistently moist, especially during the growing season. Water when the soil surface feels dry but avoid waterlogging.">
                  Water regularly to keep the soil consistently moist,
                  especially during the growing season. Water when the soil
                  surface feels dry but avoid waterlogging.
                </option>
                <option value="Water every 1-2 weeks depending on the weather. Allow the soil to dry out between waterings. Overwatering can lead to root rot, so it’s better to let the soil dry completely.">
                  Water every 1-2 weeks depending on the weather. Allow the soil
                  to dry out between waterings. Overwatering can lead to root
                  rot, so it’s better to let the soil dry completely.
                </option>
                <option value="Water when the top 2 inches of soil feel dry. Ensure good drainage to prevent the plant from becoming waterlogged.">
                  Water when the top 2 inches of soil feel dry. Ensure good
                  drainage to prevent the plant from becoming waterlogged.
                </option>
                <option value="Water when the topsoil feels dry to the touch. Avoid overwatering, as it can cause root rot.">
                  Water when the topsoil feels dry to the touch. Avoid
                  overwatering, as it can cause root rot.
                </option>
              </select>
            </div>
            {/* Growth Rate */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Growth Rate
              </label>
              <select
                name="growthRate"
                value={formData?.growthRate || ""}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="Fast">Fast</option>
                <option value="Moderate">Moderate</option>
                <option value="Slow">Slow</option>
              </select>
            </div>
            {/* Replacement Available */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Replacement Available
              </label>
              <select
                name="replacementAvailable"
                value={formData?.replacementAvailable ? "true" : "false"}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            {/* PreOrder Status*/}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Preorder Status
              </label>
              <select
                name="preOrderStatus"
                value={formData?.preOrderStatus ? "true" : "false"}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            {/* place*/}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Place
              </label>
              <select
                name="place"
                value={formData?.place || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Pet Friendly">Pet Friendly</option>
              </select>
            </div>
            {/* Benefits */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Benefits
              </label>
              <select
                name="benefits"
                value={formData?.benefits || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 border border-gray-300 rounded w-full bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Benefits</option>
                <option value="Known for its lush, attractive foliage. Adds greenery and vibrancy to indoor spaces.">
                  Known for its lush, attractive foliage. Adds greenery and
                  vibrancy to indoor spaces.
                </option>
                <option value="Excellent for hanging baskets or as a decorative houseplant. Known for its air-purifying qualities.">
                  Excellent for hanging baskets or as a decorative houseplant.
                  Known for its air-purifying qualities.
                </option>
                <option value="Beautiful ornamental plant for fences, trellises, and hanging baskets. Commonly used in tropical and subtropical landscaping.">
                  Beautiful ornamental plant for fences, trellises, and hanging
                  baskets. Commonly used in tropical and subtropical
                  landscaping.
                </option>
                <option value="An ornamental palm, often used in Mediterranean and tropical landscaping. Adds a tropical flair to outdoor gardens.">
                  An ornamental palm, often used in Mediterranean and tropical
                  landscaping. Adds a tropical flair to outdoor gardens.
                </option>
                <option value="Used in Filipino and Southeast Asian cuisine for its tangy fruit. Great for juicing and garnishing.">
                  Used in Filipino and Southeast Asian cuisine for its tangy
                  fruit. Great for juicing and garnishing.
                </option>
                <option value="Often used in landscaping and as a decorative addition to gardens. Hardy plant, suitable for xeriscaping.">
                  Often used in landscaping and as a decorative addition to
                  gardens. Hardy plant, suitable for xeriscaping.
                </option>
                <option value="Aromatic leaves used in Indian cuisine, especially in curries. Medicinal benefits, such as aiding digestion and reducing inflammation.">
                  Aromatic leaves used in Indian cuisine, especially in curries.
                  Medicinal benefits, such as aiding digestion and reducing
                  inflammation.
                </option>
                <option value="Decorative plant for gardens and homes. Suited for tropical and subtropical climates.">
                  Decorative plant for gardens and homes. Suited for tropical
                  and subtropical climates.
                </option>
                <option value="Ornamental houseplant known for its striking appearance. Adds a tropical flair to indoor décor.">
                  Ornamental houseplant known for its striking appearance. Adds
                  a tropical flair to indoor décor.
                </option>
                <option value="Popular ornamental plant for bonsai enthusiasts. Adds a unique, artistic touch to indoor spaces.">
                  Popular ornamental plant for bonsai enthusiasts. Adds a
                  unique, artistic touch to indoor spaces.
                </option>
                <option value="Highly ornamental with large, glossy leaves. Ideal for creating a statement in modern interior design.">
                  Highly ornamental with large, glossy leaves. Ideal for
                  creating a statement in modern interior design.
                </option>
                <option value="Excellent for hanging baskets or trailing in decorative pots. Known for its air-purifying properties.">
                  Excellent for hanging baskets or trailing in decorative pots.
                  Known for its air-purifying properties.
                </option>
                <option value="Edible fruit used in beverages, jams, and desserts. High in vitamin C, with potential medicinal uses.">
                  Edible fruit used in beverages, jams, and desserts. High in
                  vitamin C, with potential medicinal uses.
                </option>
                <option value="Commonly used as an indoor decorative plant. Known for its air-purifying properties, making it ideal for improving indoor air quality.">
                  Commonly used as an indoor decorative plant. Known for its
                  air-purifying properties, making it ideal for improving indoor
                  air quality.
                </option>
                <option value="Widely used in Feng Shui for attracting good luck and positive energy. Popular as a houseplant or office decoration.">
                  Widely used in Feng Shui for attracting good luck and positive
                  energy. Popular as a houseplant or office decoration.
                </option>
                <option value="Edible fruit used in a variety of dishes, including juices, salads, and desserts. The tree provides shade and is an ornamental addition to gardens.">
                  Edible fruit used in a variety of dishes, including juices,
                  salads, and desserts. The tree provides shade and is an
                  ornamental addition to gardens.
                </option>
                <option value="Known as a symbol of good luck and prosperity. Popular in Feng Shui practices for bringing positive energy.">
                  Known as a symbol of good luck and prosperity. Popular in Feng
                  Shui practices for bringing positive energy.
                </option>
                <option value="Ornamental vine with striking, fenestrated leaves. Ideal for indoor decoration, adding a tropical touch.">
                  Ornamental vine with striking, fenestrated leaves. Ideal for
                  indoor decoration, adding a tropical touch.
                </option>
                <option value="Decorative tree with symmetrical foliage. Often used as a Christmas tree due to its attractive appearance.">
                  Decorative tree with symmetrical foliage. Often used as a
                  Christmas tree due to its attractive appearance.
                </option>
              </select>
            </div>
            {/* Images */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Upload Img
              </label>
              <input
                // type="file"
                name="imgs"
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                multiple
              />
            </div>
            {/*  Nutritional Needs */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Nutritional Needs
              </label>
              <select
                name="nutritionalNeeds"
                value={formData?.nutritionalNeeds || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Nutritional Needs</option>
                <option value="Feed with a balanced liquid fertilizer every 6-8 weeks during the growing season. Enrich the soil with organic matter for better growth.">
                  Feed with a balanced liquid fertilizer every 6-8 weeks during
                  the growing season. Enrich the soil with organic matter for
                  better growth.
                </option>
                <option value="Feed with a balanced fertilizer once every month during the growing season. Ferns also benefit from occasional misting to provide extra humidity.">
                  Feed with a balanced fertilizer once every month during the
                  growing season. Ferns also benefit from occasional misting to
                  provide extra humidity.
                </option>
                <option value="Requires occasional feeding during the blooming season, especially with a low-nitrogen fertilizer. Bougainvillea benefits from added compost or organic matter to encourage vibrant blooms.">
                  Requires occasional feeding during the blooming season,
                  especially with a low-nitrogen fertilizer. Bougainvillea
                  benefits from added compost or organic matter to encourage
                  vibrant blooms.
                </option>
                <option value="Feed every month during the growing season with a balanced liquid fertilizer. Avoid heavy fertilizing during the winter months.">
                  Feed every month during the growing season with a balanced
                  liquid fertilizer. Avoid heavy fertilizing during the winter
                  months.
                </option>
                <option value="Feed with a balanced citrus fertilizer every 4-6 weeks during the growing season. Calamondin trees also benefit from occasional compost application to boost soil fertility.">
                  Feed with a balanced citrus fertilizer every 4-6 weeks during
                  the growing season. Calamondin trees also benefit from
                  occasional compost application to boost soil fertility.
                </option>
              </select>
            </div>
            {/* Seasonal Availability */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Seasonal Availability
              </label>
              <select
                name="seasonalAvailability"
                value={formData?.seasonalAvailability || ""}
                onChange={handleChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Availability</option>
                <option value="All-Year-Round">All-Year-Round</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
            </div>
            {/* Propagation Method */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Propagation Method
              </label>
              <select
                name="propagationMethod"
                value={formData.propagationMethod || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Propagation Method</option>
                <option value="Cuttings, Seeds">Cuttings, Seeds</option>
                <option value="Cuttings">Cuttings</option>
                <option value="Seeds, Grafting">Seeds, Grafting</option>
                <option value="Seeds">Seeds</option>
              </select>
            </div>
            {/* Pest Resistance */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Pest Resistance
              </label>
              <select
                name="pestResistance"
                value={formData?.pestResistance || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Pest Resistance</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>
            {/* Toxicity Level */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Toxicity Level
              </label>
              <select
                name="toxicityLevel"
                value={formData?.toxicityLevel || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Toxicity Level</option>
                <option value="Non-toxic">Non-toxic </option>
              </select>
            </div>
            {/* Tag  */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Tag
              </label>
              <select
                name="tag"
                value={formData?.tag || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Tag</option>
                <option value="Trending Now">Trending Now</option>
                <option value="On Sale">On Sale</option>
              </select>
            </div>
            {/* Plant Tags */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Plant Tags
              </label>
              <select
                name="plantTags"
                value={formData?.plantTags || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Tag</option>
                <option value="Superfood plants, drought-tolerant, multipurpose trees, fast-growing plants.">
                  Superfood plants, drought-tolerant, multipurpose trees,
                  fast-growing plants.
                </option>
                <option value="Berry plants, silkworm trees, edible fruits, hardy plants.">
                  Berry plants, silkworm trees, edible fruits, hardy plants.
                </option>
                <option value="Citrus fruits, refreshing juice, vitamin C, tropical gardening.">
                  Citrus fruits, refreshing juice, vitamin C, tropical
                  gardening.
                </option>
                <option value="Fruit trees, tropical plants, hardy plants, medicinal plants.">
                  Fruit trees, tropical plants, hardy plants, medicinal plants.
                </option>
              </select>
            </div>
            {/* PromotionTags */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                PromotionTags
              </label>
              <select
                name="promotionTags"
                value={formData?.promotionTags || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Promotion Tag</option>
                <option value="Hot Deals">Hot Deals</option>
              </select>
            </div>
            {/* Plant Accessories   */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Plant Accessories
              </label>
              <select
                name="plantAccessories"
                value={formData?.plantAccessories || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Plant Accessories</option>
                <option value="Moringa seeds, powder, oils.">
                  Moringa seeds, powder, oils.
                </option>
                <option value="Mulberry saplings, fertilizers, pruning shears.">
                  Mulberry saplings, fertilizers, pruning shears.
                </option>
                <option value="Mosambi saplings, citrus fertilizers, organic pesticides.">
                  Mosambi saplings, citrus fertilizers, organic pesticides.
                </option>
                <option value="Wood apple fruit, chutney mix, Ayurvedic supplements.">
                  Wood apple fruit, chutney mix, Ayurvedic supplements.
                </option>
              </select>
            </div>
            {/* Category  */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData?.category || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Category</option>
                <option value="Trees & Shrubs">Trees & Shrubs</option>
              </select>
            </div>

            {/* Plant Care  */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Plant Care
              </label>
              <select
                name="plantCare"
                value={formData?.plantCare || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 border border-gray-300 rounded w-full max-w-md overflow-hidden"
              >
                <option value="">Select Plant Care</option>
                <option
                  className=""
                  value="Prefers warm temperatures and bright indirect light. Keep the soil evenly moist, not soggy. Avoid drafts and sudden temperature changes."
                >
                  Prefers warm temperatures and bright indirect light. Keep the
                  soil evenly moist, not soggy. Avoid drafts and sudden
                  temperature changes.
                </option>
                <option
                  className=""
                  value="Prefers bright, indirect light and high humidity. Keep the soil moist but not waterlogged. Mist the leaves regularly to maintain humidity."
                >
                  Prefers bright, indirect light and high humidity. Keep the
                  soil moist but not waterlogged. Mist the leaves regularly to
                  maintain humidity.
                </option>
                <option
                  className=""
                  value="Requires full sun for best flowering. Water deeply but allow the soil to dry out between waterings. Prune regularly to shape the plant and remove spent flowers. Drought-tolerant once established."
                >
                  Requires full sun for best flowering. Water deeply but allow
                  the soil to dry out between waterings. Prune regularly to
                  shape the plant and remove spent flowers. Drought-tolerant
                  once established.
                </option>
                <option
                  className=""
                  value="Thrives in full sun and well-drained soil. Water moderately, allowing the soil to dry out slightly between waterings. Tolerant of drought once established. Prune dead fronds to maintain its appearance."
                >
                  Thrives in full sun and well-drained soil. Water moderately,
                  allowing the soil to dry out slightly between waterings.
                  Tolerant of drought once established. Prune dead fronds to
                  maintain its appearance.
                </option>
              </select>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="mt-6 w-36 text-xl py-3 bg-[#7AA363] text-white rounded-md hover:bg-[#83ce58] transition duration-300 font-medium"
            >
              {id ? "Update Plant" : "Add Plant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlantsAdmin;
