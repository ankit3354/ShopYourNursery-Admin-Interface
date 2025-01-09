import React, { useEffect, useState, useRef } from "react";
import { usePlantsAdminContext } from "@/contexts/PlantsAdminProvider";
import { useParams, useNavigate } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import edit from "../../assets/AdminForm/clarity_note-edit-solid.svg";
import uplaod from "../../assets/AdminForm/et_upload.svg";

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
      <div className="w-[1200px] mx-auto bg-[#F5F5F5] rounded-lg mt-20">
        <form
          action="/api/postInplants_admin"
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex gap-12 flex-col"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-[20px] font-medium font-['Poppins']">
              Monstera Deliciosa
            </h1>
            <div className="flex items-start gap-[12px]">
              <div className="flex gap-[10px] justify-center items-center p-[10px] bg-[#7AA262] rounded-[8px] shadow-md shadow-gray-500/50 cursor-pointer hover:bg-[#51912d] active:bg-[#7AA262]focus:outline-none focus:ring-2 focus:ring-[#b6f392] focus:ring-offset-2 transition">
                <img src={edit} alt="" />
                <button className="text-[12px] font-['Poppins'] text-white font-normal">
                  Edit
                </button>
              </div>

              <div className="flex gap-[10px] justify-center items-center p-[10px] bg-[#FF5E5E] rounded-[8px] shadow-md shadow-gray-500/50 cursor-pointer hover:bg-red-600 active:bg-[#972a2a]focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition">
                <button className="text-[12px] font-['Poppins'] text-white font-normal">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 ">
            {/* Left*/}
            <div className="flex flex-col items-start gap-[30px] ">
              {/* Images */}
              <div className="h-[341px] w-[411px] px-[84px] py-[140px] bg-[#FEFEFE] rounded-[10px] border-[1px] border-dashed border-[#638424]">
                <div className="flex flex-col gap-[14px] items-center justify-center self-stretch">
                  <img src={uplaod} alt="uplaod-Image" />
                  <div className="flex flex-col items-center self-stretch gap-[10px]">
                    <h1 className="text-[14px] leading-normal font-['Poppins'] font-medium text-center text-black">
                      Image
                    </h1>
                    <div className="">
                      <div className="flex items-center">
                        <input
                          type="file"
                          name="imgs"
                          onChange={handleChange}
                          multiple
                          ref={fileInputRef}
                        />
                      </div>
                      <div className="w-full flex flex-wrap">
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
                </div>
              </div>
              {/* Left Bottom  */}
              <div className="flex flex-col gap-5 w-[411px]">
                {/* Size */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Size:
                  </label>
                  <div className="flex gap-2 shrink-0 w-[w-[191px]]">
                    {["Small", "Medium", "Large"].map((sizeOption) => (
                      <div key={sizeOption} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`size-${sizeOption}`}
                          name="size"
                          value={sizeOption.toLowerCase()}
                          checked={formData.size.includes(
                            sizeOption.toLowerCase()
                          )}
                          onChange={handleChange}
                          className="h-[20px] w-[20px] text-[#7AA363] border-gray-300 rounded focus:ring-2 focus:ring-[#7AA363]"
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
                {/* Quantity */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                    required
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  />
                </div>
                {/* Price */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Price:
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    required
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  />
                </div>
                {/* Marked Price */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Marked Price:
                  </label>
                  <input
                    type="number"
                    name="markedPrice"
                    value={formData.markedPrice || ""}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  />
                </div>
                {/* place*/}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Place:
                  </label>
                  <select
                    name="place"
                    value={formData?.place || ""}
                    onChange={handleArrayChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none "
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Pet Friendly">Pet Friendly</option>
                  </select>
                </div>
                {/* Discount Percentage */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Discount Percentage:
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage || ""}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  />
                </div>
                {/* Growth Rate */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Growth Rate:
                  </label>
                  <select
                    name="growthRate"
                    value={formData?.growthRate || ""}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  >
                    <option value="Fast">Fast</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Slow">Slow</option>
                  </select>
                </div>
                {/* Replacement Available */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Replacement Available:
                  </label>
                  <select
                    name="replacementAvailable"
                    value={formData?.replacementAvailable ? "true" : "false"}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                {/* PreOrder Status */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Preorder Status:
                  </label>
                  <select
                    name="preOrderStatus"
                    value={formData?.preOrderStatus ? "true" : "false"}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                {/* Featured */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Featured:
                  </label>
                  <select
                    name="featured"
                    value={formData.featured ? "true" : "false"}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                {/* Seasonal Availability */}
                <div className="flex items-center gap-5">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Seasonal Availability:
                  </label>
                  <select
                    name="seasonalAvailability"
                    value={formData?.seasonalAvailability || ""}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  >
                    <option value="">Select Availability</option>
                    <option value="All-Year-Round">All-Year-Round</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="flex flex-col gap-5">
              {/* Title */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Title&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  required
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                />
              </div>
              {/* Category  */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Category&nbsp;&nbsp;:
                </label>
                <select
                  name="category"
                  value={formData?.category || ""}
                  onChange={handleArrayChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Trees & Shrubs">Trees & Shrubs</option>
                </select>
              </div>
              {/* Water Frequency */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Water Frequency&nbsp;&nbsp;:
                </label>
                <select
                  name="waterFrequency"
                  value={formData?.waterFrequency || ""}
                  onChange={handleChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="partial-sun">
                    Partial Sun / Partial Shade
                  </option>
                  <option value="full-sun">Full Sun</option>
                  <option value="shade">Shade</option>
                  <option value="indirect-light">Indirect Light</option>
                  <option value="low-light">Low Light</option>
                </select>
              </div>
              {/* Water Frequency Description */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Water Frequency Description&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  name="waterFrequencyDescription"
                  value={inputValues.waterFrequencyDescription}
                  placeholder="Enter Water Frequency Descriptions"
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  onChange={handleTextChange}
                />
              </div>
              {/* Benefits */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Benefits&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  name="benefits"
                  placeholder="Enter 5 Plant Benefits"
                  value={inputValues.benefits}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  onChange={handleTextChange}
                />
              </div>
              {/* Nutritional Needs */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Nutritional Needs&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  name="nutritionalNeeds"
                  placeholder="Enter 5 Nutritional Needs"
                  value={inputValues.nutritionalNeeds}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  onChange={handleTextChange}
                />
              </div>
              {/* Propagation Method */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Propagation Method&nbsp;&nbsp;:
                </label>
                <select
                  name="propagationMethod"
                  value={formData.propagationMethod || ""}
                  onChange={handleArrayChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="">Select Propagation Method</option>
                  <option value="Cuttings, Seeds">Cuttings, Seeds</option>
                  <option value="Cuttings">Cuttings</option>
                  <option value="Seeds, Grafting">Seeds, Grafting</option>
                  <option value="Seeds">Seeds</option>
                </select>
              </div>
              {/* Pest Resistance */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Pest Resistance&nbsp;&nbsp;:
                </label>
                <select
                  name="pestResistance"
                  value={formData?.pestResistance || ""}
                  onChange={handleArrayChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="">Select Pest Resistance</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                </select>
              </div>
              {/* Toxicity Level */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Toxicity Level&nbsp;&nbsp;:
                </label>
                <select
                  name="toxicityLevel"
                  value={formData?.toxicityLevel || ""}
                  onChange={handleArrayChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="">Select Toxicity Level</option>
                  <option value="Non-toxic">Non-toxic</option>
                </select>
              </div>
              {/* Sunlight Requirement */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Sunlight Requirement&nbsp;&nbsp;:
                </label>
                <select
                  name="sunlightRequirement"
                  value={formData?.sunlightRequirement || ""}
                  onChange={handleChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="partial-sun">
                    Partial Sun / Partial Shade
                  </option>
                  <option value="full-sun">Full Sun</option>
                  <option value="shade">Shade</option>
                  <option value="indirect-light">Indirect Light</option>
                  <option value="low-light">Low Light</option>
                </select>
              </div>
              {/* Tag */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Tag&nbsp;&nbsp;:
                </label>
                <select
                  name="tag"
                  value={formData?.tag || ""}
                  onChange={handleArrayChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="">Select Tag</option>
                  <option value="Trending Now">Trending Now</option>
                  <option value="On Sale">On Sale</option>
                </select>
              </div>
              {/* Promotion Tags */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Promotion Tags&nbsp;&nbsp;:
                </label>
                <select
                  name="promotionTags"
                  value={formData?.promotionTags || ""}
                  onChange={handleArrayChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="">Select Promotion Tag</option>
                  <option value="Hot Deals">Hot Deals</option>
                </select>
              </div>
              {/* Plant Tags */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Plant Tags&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  name="plantTags"
                  placeholder="Enter Plants Tags"
                  value={inputValues.plantTags}
                  onChange={handleTextChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                />
              </div>
              {/* Plant Accessories */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Plant Accessories&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  name="plantAccessories"
                  placeholder="Enter 5 Nutritional Needs"
                  value={inputValues.plantAccessories}
                  onChange={handleTextChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                />
              </div>
              {/* Plant Care */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Plant Care&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  name="plantCare"
                  placeholder="Enter 5 Nutritional Needs"
                  value={inputValues.plantCare}
                  onChange={handleTextChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                />
              </div>
              {/* Popular Dropdown */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Popular&nbsp;&nbsp;:
                </label>
                <select
                  name="popular"
                  value={formData?.popular ? "true" : "false"}
                  onChange={handleChange}
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              {/* Description */}
              <div className="flex items-center gap-5 w-[560px]">
                <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  required
                  className="flex flex-col items-start gap-2 shrink-0 w-[360px] h-[104px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="text-center flex items-center justify-center gap-[16px]">
            <button
              type="submit"
              className="w-36 text-xl h-[44px] bg-[#7AA363] text-white rounded-md duration-300 font-medium hover:bg-[#51912d] active:bg-[#7AA262]focus:outline-none focus:ring-2 focus:ring-[#b6f392] focus:ring-offset-2 transition shadow-lg"
            >
              {id ? "Update Plant" : "Add Plant"}
            </button>
            {id && (
              <button className="w-36 text-xl h-[44px] bg-[#fff] text-black rounded-md duration-300 font-medium hover:bg-[#c1c1c1] active:bg-[#7AA262]focus:outline-none focus:ring-2 focus:ring-[#b6f392] focus:ring-offset-2 transition shadow-lg">
                {"Cancel"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlantsAdmin;
