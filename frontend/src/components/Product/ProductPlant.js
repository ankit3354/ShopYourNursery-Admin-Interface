import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { IoTrashBinSharp } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setLoading } from "@/feature/PlantsAdmin/plantsAdminSlice";
import { usePlantsAdminContext } from "@/contexts/PlantsAdminProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function ProductPlant({ product }) {
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
        }
        catch (error) {
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
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
        }
    };
    const handleEdit = () => {
        navigate(`/admin/${product._id}`);
    };
    return (_jsxs("div", { className: "shrink-0 flex flex-col justify-center relative cursor-pointer w-[11rem] max-w-[11rem] mx-auto border-none overflow-hidden border-black h-fit", children: [_jsxs("div", { className: "flex h-[14rem] w-[11rem] rounded-[0.9375rem] bg-slate-200 relative group", children: [_jsx("img", { src: product.imgs?.[currentImageIndex] || "", alt: product.title, className: "object-cover rounded-[0.9375rem] h-full w-full" }), totalImages > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { className: "absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200", onClick: prevImage, children: "\u276E" }), _jsx("button", { className: "absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200", onClick: nextImage, children: "\u276F" })] }))] }), _jsxs("div", { className: "flex flex-col ", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 truncate mt-3", children: product.title }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { children: "Rating" }), _jsx("span", { className: "text-yellow-400", children: "\u2605" }), _jsxs("span", { className: "text-sm text-gray-600", children: [product.rating, " / 5"] })] }), _jsxs("div", { className: "mt-1 text-md font-semibold", children: [_jsx("span", { children: "Marked Price :" }), _jsxs("span", { className: "text-red-600 line-through", children: ["$", product?.markedPrice ? product?.markedPrice.toFixed(2) : "0.00"] })] }), _jsxs("div", { className: "mt-1 text-md font-semibold", children: [_jsx("span", { children: "Price :" }), _jsxs("span", { className: "text-green-600 ", children: ["$", product.price.toFixed(2)] })] }), _jsxs("div", { className: "mt-1 mb-2 text-sm text-gray-500", children: [_jsxs("p", { children: ["Category: ", product.category] }), _jsxs("p", { children: ["Place: ", product.place] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: handleEdit, children: _jsx(FiEdit, { className: "text-blue-500" }) }), _jsx("button", { onClick: handleDeletePlantAdmin, children: _jsx(IoTrashBinSharp, { className: "text-red-700" }) })] })] })] }));
}
export default ProductPlant;
