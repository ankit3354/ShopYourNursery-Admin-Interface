import React, { useEffect, useState, useRef } from "react";
import { usePlantsAdminContext } from "@/contexts/PlantsAdminProvider";
import { useParams, useNavigate } from "react-router-dom";
import uplaod from "../../assets/AdminForm/et_upload.svg";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";

function PlantsAdmin() {
  const { handleAddPlantsAdmin, handleUpdatePlantsAdmin, getPlantById } =
    usePlantsAdminContext(); // Access the context
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addPlant } = handleAddPlantsAdmin;
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const initialFormData = {
    title: "",
    description: "",
    // price: 0,
    // discountPercentage: 0,
    // markedPrice: 0,
    // quantity: 0,
    reviewsCount: 0,
    rating: 0,
    featured: false,
    popular: false,
    sizeDetails: [
      {
        size: "small",
        price: 0,
        marketPrice: 0,
        discountPercentage: 0,
        quantity: 0,
      },
      {
        size: "medium",
        price: 0,
        marketPrice: 0,
        discountPercentage: 0,
        quantity: 0,
      },
      {
        size: "large",
        price: 0,
        marketPrice: 0,
        discountPercentage: 0,
        quantity: 0,
      },
    ], // Change from [] to ""
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
    const { name, type, checked, value, files, dataset } = e.target;
    // Delegate sizeDetails updates to handleDetailChange
    if (dataset?.index !== undefined && dataset.field) {
      handleDetailChange(
        parseInt(dataset.index, 10),
        dataset.field,
        type === "checkbox" ? checked : value
      );
      return;
    }
    // Handle general form updates
    setFormData((prevData) => {
      let newValue: any;
      if (type === "file") {
        const fileArray = Array.from(files || []);
        newValue = fileArray;
        setInputValues((prevInputValues: any) => ({
          ...prevInputValues,
          imgs: fileArray.map((file: any) => file.name),
        }));
      } else if (type === "checkbox" && Array.isArray(prevData[name])) {
        newValue = checked
          ? [...prevData[name], value]
          : prevData[name].filter((item: any) => item !== value);
      } else if (type === "checkbox") {
        newValue = checked;
      } else if (value === "true" || value === "false") {
        newValue = value === "true";
      } else {
        newValue = value;
      }
      return { ...prevData, [name]: newValue };
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

  const handleClearAll = () => {
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
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + inputValues.imgs.length) % inputValues.imgs.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % inputValues.imgs.length);
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    setFormData((prevData) => {
      const updatedSizeDetails = [...prevData.sizeDetails];
      updatedSizeDetails[index] = {
        ...updatedSizeDetails[index],
        [field]: value,
      };
      return { ...prevData, sizeDetails: updatedSizeDetails };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting data:", formData);
    try {
      const formDataToSend = new FormData();
      // Append all form data fields
      for (const key in formData) {
        const value = formData[key];
        if (key === "imgs" && Array.isArray(value)) {
          // Append image files separately
          value.forEach((file) => formDataToSend.append("imgs", file));
        } else if (key === "sizeDetails" && Array.isArray(value)) {
          // Serialize sizeDetails as JSON string
          formDataToSend.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          // Handle other array fields
          value.forEach((item) => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, value);
        }
      }
      if (id) {
        await handleUpdatePlantsAdmin.mutate({
          id,
          updateData: formDataToSend,
        });
        console.log("Plant updated successfully!");
      } else {
        const newPlant = await addPlant(formDataToSend);
        console.log("Plant added successfully:", newPlant);
      }
      // Reset form after submission
      setFormData(initialFormData);
      setInputValues({
        imgs: [],
        waterFrequencyDescription: "",
        benefits: "",
        nutritionalNeeds: "",
        plantAccessories: "",
        plantCare: "",
        plantTags: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      navigate("/admin");
    } catch (error) {
      console.error("Failed to add plant:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 border-[1px] font-['Poppins']">
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
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 ">
            {/* Left*/}
            <div className="flex flex-col items-start gap-[30px] ">
              {/* Images */}
              <div className="relative h-[341px] w-[411px] bg-[#FEFEFE] rounded-[10px] border-[1px] border-dashed border-[#638424] shadow-md shadow-gray-500/40">
                {/* If images exist */}
                {inputValues.imgs.length > 0 ? (
                  <div className="h-full w-full relative">
                    <div className="relative h-full w-full flex items-center justify-center">
                      {/* Full-size image */}
                      <img
                        src={URL.createObjectURL(
                          formData.imgs.find(
                            (file: any) =>
                              file.name === inputValues.imgs[currentIndex]
                          )
                        )}
                        alt={`Preview ${currentIndex}`}
                        className="h-full w-full object-cover rounded-[10px]"
                      />
                      {/* Remove Icon */}
                      <TiDelete
                        onClick={() =>
                          handleRemoveImage(inputValues.imgs[currentIndex])
                        }
                        className="absolute top-2 right-2 text-white hover:text-red-500 shadow-md text-2xl"
                      />
                    </div>
                    {/* Left Arrow */}
                    {inputValues.imgs.length > 1 && (
                      <FaAngleLeft
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/20  text-white p-2 rounded-full hover:bg-gray-700/50 shadow-md text-4xl"
                      />
                    )}
                    {/* Right Arrow */}
                    {inputValues.imgs.length > 1 && (
                      <FaAngleRight
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/20 text-white p-2 rounded-full hover:bg-gray-700/50 shadow-md text-4xl"
                      />
                    )}
                    {/* Display Numbers for Image Navigation */}
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
                      {inputValues.imgs.map((_, index) => (
                        <span
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`cursor-pointer flex items-center justify-center rounded-full font-semibold border-[1px] border-gray-200 px-2  ${
                            index === currentIndex
                              ? " text-white text-[12px]"
                              : "text-[#c0c1bf] text-[10px]"
                          }`}
                        >
                          {index + 1}
                        </span>
                      ))}
                    </div>
                    {/* Upload/Edit Button when images exist */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <input
                        type="file"
                        name="imgs"
                        onChange={handleChange}
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`${
                          inputValues.imgs.length > 0
                            ? "text-white border-gray-200  hover:text-[#212020]"
                            : "text-[#323232] border-gray-700 "
                        } border-[1px] px-2 py-1 rounded-md text-[12px] font-normal hover:bg-[#dcdbdb88]`}
                      >
                        Upload or Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[14px] items-center justify-center h-full w-full">
                    {/* Upload Placeholder */}
                    <img
                      src={uplaod}
                      alt="Upload Placeholder"
                      className="w-16 h-16"
                    />
                    <h1 className="text-[14px] leading-normal font-['Poppins'] font-medium text-center text-black">
                      Image
                    </h1>
                    {/* Upload/Edit Button when no images */}
                    <div className="mt-4">
                      <input
                        type="file"
                        name="imgs"
                        onChange={handleChange}
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`${
                          inputValues.imgs.length > 0
                            ? "text-white border-gray-200"
                            : "text-[#323232] border-gray-700"
                        } border-[1px] px-2 py-1 rounded-md text-[12px] font-normal hover:bg-[#dcdbdb]`}
                      >
                        Upload or Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Left Bottom  */}
              <div className="flex flex-col gap-5 w-[411px]">
                <div className="flex flex-col gap-5">
                  {formData.sizeDetails.map((detail: any, index: number) => (
                    <div key={detail.size} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        {/* Size Checkbox */}
                        <input
                          type="checkbox"
                          checked={detail.showDetails || false}
                          data-index={index}
                          data-field="showDetails"
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <h4 className="text-lg font-medium">
                          Size:
                          {detail.size.charAt(0).toUpperCase() +
                            detail.size.slice(1)}
                        </h4>
                      </div>
                      {/* Conditionally Render Price and Marked Price Inputs */}
                      {detail.showDetails && (
                        <>
                          {/* Price Input */}
                          <div className="flex items-center gap-5">
                            <label className="w-[200px] font-['Poppins'] text-[18px]">
                              Price:
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={detail.price || ""}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              className="w-[191px] p-2 border bg-[#ECECEC] rounded text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                            />
                          </div>
                          {/* Marked Price Input */}
                          <div className="flex items-center gap-5">
                            <label className="w-[200px] font-['Poppins'] text-[18px]">
                              Market Price:
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={detail.marketPrice || ""}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "marketPrice",
                                  e.target.value
                                )
                              }
                              className="w-[191px] p-2 border bg-[#ECECEC] rounded text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                            />
                          </div>
                          {/* Quantity Input */}
                          <div className="flex items-center gap-5">
                            <label className="w-[200px] font-['Poppins'] text-[18px]">
                              Quantity:
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={detail.quantity || ""}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="w-[191px] p-2 border bg-[#ECECEC] rounded text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                            />
                          </div>
                          {/* discountPercentage Input */}
                          <div className="flex items-center gap-5">
                            <label className="w-[200px] font-['Poppins'] text-[18px]">
                              Discount Percentage:
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={detail.discountPercentage || ""}
                              onChange={(e) =>
                                handleDetailChange(
                                  index,
                                  "discountPercentage",
                                  e.target.value
                                )
                              }
                              className="w-[191px] p-2 border bg-[#ECECEC] rounded text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Size */}
                {/* <div className="flex items-center gap-5 w-[411px]">
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
                </div> */}
                {/* Quantity */}
                {/* <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  />
                </div> */}
                {/* Price */}
                {/* <div className="flex items-center gap-5 w-[411px]">
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
                </div> */}
                {/* Marked Price */}
                {/* <div className="flex items-center gap-5 w-[411px]">
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
                </div> */}
                {/* Discount Percentage */}
                {/* <div className="flex items-center gap-5 w-[411px]">
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
                </div> */}
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
                {/* Pest Resistance */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Pest Resistance&nbsp;&nbsp;:
                  </label>
                  <select
                    name="pestResistance"
                    value={formData?.pestResistance || ""}
                    onChange={handleArrayChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  >
                    <option value="">Select Resistance</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </div>
                {/* Propagation Method */}
                <div className="flex items-center gap-5 w-[411px]">
                  <label className="text-black shrink-0 w-[200px] font-['Poppins'] text-[18px] font-normal leading-normal">
                    Propagation Method&nbsp;&nbsp;:
                  </label>
                  <select
                    name="propagationMethod"
                    value={formData.propagationMethod || ""}
                    onChange={handleArrayChange}
                    className="flex flex-col items-start gap-2 shrink-0 w-[191px] h-[44px] p-[10px_21px] border border-gray-300 bg-[#ECECEC] rounded-[10px] text-gray-700 focus:ring-2 focus:ring-[#7AA363] focus:outline-none"
                  >
                    <option value="">Select Method</option>
                    <option value="Cuttings, Seeds">Cuttings, Seeds</option>
                    <option value="Cuttings">Cuttings</option>
                    <option value="Seeds, Grafting">Seeds, Grafting</option>
                    <option value="Seeds">Seeds</option>
                  </select>
                </div>
                {/* Seasonal Availability */}
                <div className="flex items-center gap-5 w-[411px]">
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
              className="w-36 text-xl h-[44px] bg-[#7AA363] text-white rounded-md duration-300 font-medium hover:bg-[#51912d] active:bg-[#7AA262]focus:outline-none focus:ring-2 focus:ring-[#b6f392] focus:ring-offset-2 transition shadow-lg shadow-gray-500/60"
            >
              {id ? "Update Plant" : "Add Plant"}
            </button>

            {id ? (
              <button
                onClick={handleClearAll}
                className="w-36 text-xl h-[44px] bg-[#fff] text-black rounded-md duration-300 font-medium hover:bg-[#c1c1c1] active:bg-[#7AA262]focus:outline-none focus:ring-2 focus:ring-[#b6f392] focus:ring-offset-2 transition shadow-lg shadow-gray-500/60"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={handleClearAll}
                className="w-36 text-xl h-[44px] bg-[#868782] text-white rounded-md duration-300 font-medium hover:bg-[#656761] active:bg-[#7AA262]focus:outline-none focus:ring-2 focus:ring-[#b6f392] focus:ring-offset-2 transition shadow-lg shadow-gray-500/60"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlantsAdmin;
