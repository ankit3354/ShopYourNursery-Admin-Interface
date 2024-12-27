import { IoTrashBinSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setLoading } from "@/feature/PlantsAdmin/plantsAdminSlice";
import { usePlantsAdminContext } from "@/contexts/PlantsAdminProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductPlant({ product }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleDeletePlantsAdmin } = usePlantsAdminContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = Array.isArray(product.imgs) ? product.imgs.length : 0;

  const handleDeletePlantAdmin = async () => {
    try {
      dispatch(setLoading(true));
      await handleDeletePlantsAdmin.mutate(product._id);
      console.log(`Plant with id ${product._id} deleted successfully.`);
    } catch (error: any) {
      console.error("Error deleting plant:", error);
    }
  };

  const nextImage = () => {
    if (totalImages > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }
  };

  const prevImage = () => {
    if (totalImages > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + totalImages) % totalImages
      );
    }
  };

  const handleEdit = () => {
    navigate(`/admin/${product._id}`);
  };

  return (
    <div className="shrink-0 flex flex-col justify-center relative cursor-pointer w-[11rem] max-w-[11rem] mx-auto border-none overflow-hidden border-black h-fit">
      <div className="flex h-[14rem] w-[11rem] rounded-[0.9375rem] bg-slate-200 relative group">
        <img
          src={product.imgs?.[currentImageIndex] || ""}
          alt={product.title}
          className="object-cover rounded-[0.9375rem] h-full w-full"
        />
        {totalImages > 1 && (
          <>
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={prevImage}
            >
              &#10094;
            </button>

            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={nextImage}
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col ">
        <h3 className="text-lg font-semibold text-gray-800 truncate mt-3">
          {product.title}
        </h3>
        <div className="flex items-center space-x-1">
          <span>Rating</span>
          <span className="text-yellow-400">★</span>
          <span className="text-sm text-gray-600">{product.rating} / 5</span>
        </div>
        <div className="mt-1 text-md font-semibold">
          <span>Marked Price :</span>
          <span className="text-red-600 line-through">
            ${product?.markedPrice ? product?.markedPrice.toFixed(2) : "0.00"}
          </span>
        </div>
        <div className="mt-1 text-md font-semibold">
          <span>Price :</span>
          <span className="text-green-600 ">${product.price.toFixed(2)}</span>
        </div>
        <div className="mt-1 mb-2 text-sm text-gray-500">
          <p>Category: {product.category}</p>
          <p>Place: {product.place}</p>
        </div>
        <div className="flex justify-between">
          <button onClick={handleEdit}>
            <FiEdit className="text-blue-500" />
          </button>
          <button onClick={handleDeletePlantAdmin}>
            <IoTrashBinSharp className="text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPlant;
