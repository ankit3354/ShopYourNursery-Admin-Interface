import React, { useEffect, useState, useRef } from "react";
import { usePlantsAdminContext } from "@/contexts/PlantsAdminProvider";
import { useParams, useNavigate } from "react-router-dom";
import { TiDelete } from "react-icons/ti";

function PlantsAdmin() {
  const { handleAddPlantsAdmin, handleUpdatePlantsAdmin, getPlantById } =
    usePlantsAdminContext(); // Access the context
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addPlant } = handleAddPlantsAdmin;
  const navigate = useNavigate();
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
    plantTags: [], // Change from [] to ""
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
    plantTags: "",
    imgs: [],
  });

  const fetchPlantData = async (plantId: any) => {
    try {
      const plantData = await getPlantById(plantId);
      if (plantData) {
        console.log("Fetched Plant Data:", plantData);
        setFormData(plantData);
        // Extract the image name from the URL
        const imageNames = plantData.imgs.map((imgUrl: string) => {
          const parts = imgUrl.split("/");
          return parts[parts.length - 1];
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
          plantTags: plantData.plantTags ? plantData.plantTags.join(". ") : "",
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
        const fileArray = Array.from(files || []);
        newValue = fileArray;
        // Update inputValues with the filenames of the new files
        const imageNames = fileArray.map((file: any) => file.name);
        setInputValues((prevInputValues: any) => ({
          ...prevInputValues,
          imgs: imageNames,
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
    setInputValues((prev) => ({ ...prev, [name]: value }));
    const newArray = value
      .split(".")
      .map((item: any) => item.trim())
      .filter((item: any) => item !== "");
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
      for (const key in formData) {
        if (key === "imgs") {
          formData[key].forEach((file: any) => {
            formDataToSend.append("imgs", file);
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
        const newPlant = await addPlant(formDataToSend);
        console.log("Plant added successfully :", newPlant);
      }
      // Reset form data
      setFormData(initialFormData);
      setInputValues({
        waterFrequencyDescription: "",
        benefits: "",
        nutritionalNeeds: "",
        plantAccessories: "",
        plantCare: "",
        plantTags: "",
        imgs: [],
      });
      navigate("/admin");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to add plant:", error);
    }
  };

  const handleRemoveImage = (filename: any) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      imgs: prevInputValues.imgs.filter((img) => img !== filename),
    }));
    setFormData((prevData) => ({
      ...prevData,
      imgs: prevData.imgs.filter((file: any) => file.name !== filename),
    }));
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
            </div>
            {/* Images */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Upload Images
              </label>
              <div className="flex flex-wrap mt-2 p-3 gap-3 rounded w-full overflow-hidden border border-gray-300 bg-white text-gray-700 hover:ring-2 hover:ring-[#7AA363] hover:outline-none">
                <div className="w-fit flex items-center ">
                  <input
                    type="file"
                    name="imgs"
                    onChange={handleChange}
                    multiple
                    ref={fileInputRef}
                  />
                </div>
                <div className="w-full flex flex-wrap gap-2 ">
                  {inputValues.imgs.map((filename) => (
                    <div
                      key={filename}
                      className="flex justify-center items-center px-2 py-1 border-[1px] border-gray-300 rounded-lg"
                    >
                      <span className="text-gray-800 font-medium text-[14px]">
                        {filename}
                      </span>
                      <TiDelete
                        onClick={() => handleRemoveImage(filename)}
                        className="hover:text-[#7AA363] text-[16px] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
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
              <input
                type="text"
                name="plantTags"
                placeholder="Enter Plants Tags"
                value={inputValues.plantTags}
                className="mt-2 p-3 rounded w-full border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                onChange={handleTextChange}
              />
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
