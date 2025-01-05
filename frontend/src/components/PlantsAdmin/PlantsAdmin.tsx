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
    size: [], // Change from [] to ""
    sunlightRequirement: "",
    waterFrequency: "",
    waterFrequencyDescription: [], // Change from [] to ""
    replacementAvailable: false,
    expertGuidance: false,
    preOrderStatus: false,
    place: "",
    growthRate: "",
    benefits: [], // Change from [] to ""
    imgs: [],
    nutritionalNeeds: [], // Change from [] to ""
    seasonalAvailability: "",
    propagationMethod: "", // Change from [] to ""
    pestResistance: "",
    toxicityLevel: "",
    tag: "",
    plantTags: "", // Change from [] to ""
    promotionTags: "",
    plantAccessories: [], // Change from [] to ""
    category: "",
    plantCare: [], // Change from [] to ""
  };
  const [formData, setFormData] =
    useState<Record<string, any>>(initialFormData);

  const [inputValues, setInputValues] = useState({
    waterFrequencyDescription: "",
    benefits: "",
    nutritionalNeeds: "",
    plantAccessories: "",
    plantCare: "",
    imgs: [],
  });

  const fetchPlantData = async (plantId: any) => {
    try {
      const plantData = await getPlantById(plantId);
      if (plantData) {
        // console.log("Fetched Plant Data:", plantData);
        setFormData(plantData);
        // Extract the image name from the URL
        const imageNames = plantData.imgs.map((imgUrl: string) => {
          const parts = imgUrl.split("/");
          return parts[parts.length - 1]; // Get the last part of the URL, which is the filename
        });
        // console.log("imageNames", imageNames);
        setInputValues({
          waterFrequencyDescription: plantData.waterFrequencyDescription
            ? plantData.waterFrequencyDescription.join(". ")
            : "",
          benefits: plantData.benefits ? plantData.benefits.join(". ") : "",
          nutritionalNeeds: plantData.nutritionalNeeds
            ? plantData.nutritionalNeeds.join(". ")
            : "",
          plantAccessories: plantData.plantAccessories
            ? plantData.plantAccessories.join(". ")
            : "",
          plantCare: plantData.plantCare ? plantData.plantCare.join(". ") : "",
          imgs: imageNames,
        });
      } else {
        console.warn("No plant data found for ID:", id);
      }
    } catch (error) {
      console.error("Error fetching plant data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlantData(id);
    }
  }, [id, getPlantById]);

  const handleChange = (e: any) => {
    const { name, type, checked, value, files } = e.target;
    setFormData((prevData) => {
      let newValue;
      if (type === "file") {
        const fileArray = Array.from(files || []); // convert Files into an array
        newValue = fileArray;
        // Update inputValues with the filenames of the new files
        const imageNames = fileArray.map((file: any) => file.name);
        setInputValues((prevInputValues: any) => ({
          ...prevInputValues,
          imgs: imageNames, // Update the imgs field in inputValues
        }));
      } else if (type === "checkbox" && Array.isArray(prevData[name])) {
        const updatedArray = checked
          ? [...prevData[name], value]
          : prevData[name].filter((item: any) => item !== value);
        newValue = updatedArray;
      } else if (type === "checkbox") {
        newValue = checked;
      } else if (value === "true" || value === "false") {
        newValue = value === "true";
      } else {
        newValue = value;
      }
      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  const handleArrayChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextChange = (event: any) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value })); // Update local input value
    // Split the input value by '.' and trim each part
    const newArray = value
      .split(".")
      .map((item: any) => item.trim())
      .filter((item: any) => item !== "");
    // Update the formData state with the new array
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newArray,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    try {
      const formDataToSend = new FormData();
      // Append text fields
      for (const key in formData) {
        if (key === "imgs") {
          formData[key].forEach((file: any) => {
            formDataToSend.append("imgs", file); // Append images as files
          });
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => {
            formDataToSend.append(key, item);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      if (id) {
        await handleUpdatePlantsAdmin.mutate({
          id,
          updateData: formDataToSend,
        });
        console.log("Plant updated successfully !");
      } else {
        // console.log("formDataToSend", formDataToSend);
        const newPlant = await addPlant(formDataToSend); // Pass the FormData here
        console.log("Plant added successfully:", newPlant);
      }
      // Reset form data
      setFormData(initialFormData);
      setInputValues({
        waterFrequencyDescription: "",
        benefits: "",
        nutritionalNeeds: "",
        plantAccessories: "",
        plantCare: "",
        imgs: [],
      });
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
        <form
          action="/api/postInplants_admin"
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
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
            <div>
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
            <div>
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
              <div className="mt-2 space-y-2">
                {["Small", "Medium", "Large"].map((sizeOption) => (
                  <div key={sizeOption} className="flex  items-center">
                    <input
                      type="checkbox"
                      id={`size-${sizeOption}`}
                      name="size"
                      value={sizeOption.toLowerCase()}
                      checked={formData.size.includes(sizeOption.toLowerCase())}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#7AA363] border-gray-300 rounded focus:ring-2 focus:ring-[#7AA363]"
                    />
                    <label
                      htmlFor={`size-${sizeOption}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {sizeOption}
                    </label>
                  </div>
                ))}
              </div>
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
              <input
                type="text"
                name="waterFrequencyDescription"
                value={inputValues.waterFrequencyDescription}
                placeholder="Enter 5 Water Frequency Descriptions"
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                onChange={handleTextChange}
              />
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
              <input
                type="text"
                name="benefits"
                placeholder="Enter 5 Plant Benefits"
                value={inputValues.benefits}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                onChange={handleTextChange}
              />
              {/* <select
                name="benefits"
                value={formData?.benefits || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 border border-gray-300 rounded w-full bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Benefits</option>
                <option value="Known for its lush, attractive foliage">
                  Known for its lush, attractive foliage
                </option>
                <option value="Adds greenery and vibrancy to indoor spaces">
                  Adds greenery and vibrancy to indoor spaces
                </option>
                <option value="Excellent for hanging baskets or as a decorative houseplant">
                  Excellent for hanging baskets or as a decorative houseplant
                </option>
                <option value="Known for its air-purifying qualities">
                  Known for its air-purifying qualities
                </option>
                <option value="Commonly used in tropical and subtropical landscaping">
                  Commonly used in tropical and subtropical landscaping
                </option>
                <option value="Beautiful ornamental plant for fences, trellises, and hanging baskets">
                  Beautiful ornamental plant for fences, trellises, and hanging
                  baskets
                </option>
                <option value="An ornamental palm, often used in Mediterranean and tropical landscaping">
                  An ornamental palm, often used in Mediterranean and tropical
                  landscaping
                </option>
                <option value="Adds a tropical flair to outdoor gardens">
                  Adds a tropical flair to outdoor gardens
                </option>
                <option value="Used in Filipino and Southeast Asian cuisine for its tangy fruit">
                  Used in Filipino and Southeast Asian cuisine for its tangy
                  fruit
                </option>
                <option value="Great for juicing and garnishing">
                  Great for juicing and garnishing
                </option>
                <option value="Often used in landscaping and as a decorative addition to gardens">
                  Often used in landscaping and as a decorative addition to
                  gardens
                </option>
                <option value="Hardy plant, suitable for xeriscaping">
                  Hardy plant, suitable for xeriscaping
                </option>
                <option value="Aromatic leaves used in Indian cuisine, especially in curries">
                  Aromatic leaves used in Indian cuisine, especially in curries
                </option>
                <option value="Medicinal benefits, such as aiding digestion and reducing inflammation">
                  Medicinal benefits, such as aiding digestion and reducing
                  inflammation
                </option>
                <option value="Decorative plant for gardens and homes">
                  Decorative plant for gardens and homes
                </option>
                <option value="Suited for tropical and subtropical climates">
                  Suited for tropical and subtropical climates
                </option>
                <option value="Ornamental houseplant known for its striking appearance">
                  Ornamental houseplant known for its striking appearance
                </option>
                <option value="Adds a tropical flair to indoor décor">
                  Adds a tropical flair to indoor décor
                </option>
                <option value="Popular ornamental plant for bonsai enthusiasts">
                  Popular ornamental plant for bonsai enthusiasts
                </option>
                <option value="Adds a unique, artistic touch to indoor spaces">
                  Adds a unique, artistic touch to indoor spaces
                </option>
                <option value="Highly ornamental with large, glossy leaves">
                  Highly ornamental with large, glossy leaves
                </option>
                <option value="Ideal for creating a statement in modern interior design">
                  Ideal for creating a statement in modern interior design
                </option>
                <option value="Excellent for hanging baskets or trailing in decorative pots">
                  Excellent for hanging baskets or trailing in decorative pots
                </option>
                <option value="Known for its air-purifying properties">
                  Known for its air-purifying properties
                </option>
                <option value="Edible fruit used in beverages, jams, and desserts">
                  Edible fruit used in beverages, jams, and desserts
                </option>
                <option value="High in vitamin C, with potential medicinal uses">
                  High in vitamin C, with potential medicinal uses
                </option>
                <option value="Commonly used as an indoor decorative plant">
                  Commonly used as an indoor decorative plant
                </option>
                <option value="Known for its air-purifying properties, making it ideal for improving indoor air quality">
                  Known for its air-purifying properties, making it ideal for
                  improving indoor air quality
                </option>
                <option value="Widely used in Feng Shui for attracting good luck and positive energy">
                  Widely used in Feng Shui for attracting good luck and positive
                  energy
                </option>
                <option value="Popular as a houseplant or office decoration">
                  Popular as a houseplant or office decoration
                </option>
                <option value="Edible fruit used in a variety of dishes, including juices, salads, and desserts">
                  Edible fruit used in a variety of dishes, including juices,
                  salads, and desserts
                </option>
                <option value="The tree provides shade and is an ornamental addition to gardens">
                  The tree provides shade and is an ornamental addition to
                  gardens
                </option>
                <option value="Known as a symbol of good luck and prosperity">
                  Known as a symbol of good luck and prosperity
                </option>
                <option value="Popular in Feng Shui practices for bringing positive energy">
                  Popular in Feng Shui practices for bringing positive energy
                </option>
                <option value="Ornamental vine with striking, fenestrated leaves">
                  Ornamental vine with striking, fenestrated leaves
                </option>
                <option value="Ideal for indoor decoration, adding a tropical touch">
                  Ideal for indoor decoration, adding a tropical touch
                </option>
                <option value="Decorative tree with symmetrical foliage">
                  Decorative tree with symmetrical foliage
                </option>
                <option value="Often used as a Christmas tree due to its attractive appearance">
                  Often used as a Christmas tree due to its attractive
                  appearance
                </option>
              </select> */}
            </div>
            {/* Images */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Upload Img
              </label>
              <input
                type="file"
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
              <input
                type="text"
                name="nutritionalNeeds"
                placeholder="Enter 5 Nutritional Needs"
                value={inputValues.nutritionalNeeds}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                onChange={handleTextChange}
              />
              {/* <select
                name="nutritionalNeeds"
                value={formData?.nutritionalNeeds || ""}
                onChange={handleArrayChange}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
              >
                <option value="">Select Nutritional Needs</option>
                <option
                  value="Enrich the soil with organic matter for
                  better growth"
                >
                  Enrich the soil with organic matter for better growth
                </option>
                <option value="Feed with a balanced liquid fertilizer every 6-8 weeks during the growing season">
                  Feed with a balanced liquid fertilizer every 6-8 weeks during
                  the growing season
                </option>
                <option value="Ferns also benefit from occasional misting to provide extra humidity">
                  Ferns also benefit from occasional misting to provide extra
                  humidity
                </option>
                <option
                  value=" Feed with a balanced fertilizer once every month during the
                  growing season"
                >
                  Feed with a balanced fertilizer once every month during the
                  growing season
                </option>
                <option value="Requires occasional feeding during the blooming season, especially with a low-nitrogen fertilizer">
                  Requires occasional feeding during the blooming season,
                  especially with a low-nitrogen fertilizer
                </option>
                <option value="Bougainvillea benefits from added compost or organic matter to encourage vibrant blooms">
                  Bougainvillea benefits from added compost or organic matter to
                  encourage vibrant blooms
                </option>
                <option value="Feed every month during the growing season with a balanced liquid fertilizer">
                  Feed every month during the growing season with a balanced
                  liquid fertilizer
                </option>
                <option
                  value="Avoid heavy fertilizing during the winter
                  months"
                >
                  Avoid heavy fertilizing during the winter months
                </option>
                <option value="Calamondin trees also benefit from occasional compost application to boost soil fertility">
                  Calamondin trees also benefit from occasional compost
                  application to boost soil fertility
                </option>
                <option
                  value="Feed with a balanced citrus fertilizer every 4-6 weeks during
                  the growing season"
                >
                  Feed with a balanced citrus fertilizer every 4-6 weeks during
                  the growing season
                </option>
              </select> */}
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
              <input
                type="text"
                name="plantAccessories"
                placeholder="Enter 5 Nutritional Needs"
                value={inputValues.plantAccessories}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                onChange={handleTextChange}
              />
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
              <input
                type="text"
                name="plantCare"
                placeholder="Enter 5 Nutritional Needs"
                value={inputValues.plantCare}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                onChange={handleTextChange}
              />
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
