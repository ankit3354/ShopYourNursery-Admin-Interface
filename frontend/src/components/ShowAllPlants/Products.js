import { jsx as _jsx } from "react/jsx-runtime";
import ProductPlant from "../Product/ProductPlant";
export default function Products({ products }) {
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 auto-rows-max gap-16", children: products.map((product) => (_jsx(ProductPlant, { product: product }, product._id))) }));
}
