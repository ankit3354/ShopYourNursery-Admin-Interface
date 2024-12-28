import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
function Navbar() {
    return (_jsx("div", { className: "bg-[#7AA363] fixed top-0 left-0 w-full z-50 shadow-md", children: _jsxs("div", { className: "max-w-6xl mx-auto flex flex-wrap justify-between items-center p-4", children: [_jsx("h1", { className: "text-white text-2xl font-bold", children: "Shopyounursery" }), _jsxs("div", { className: "flex flex-wrap justify-center space-x-4", children: [_jsx(Link, { to: "/", className: "text-white font-medium hover:text-gray-200 transition duration-300", children: "Home" }), _jsx(Link, { to: "/admin", className: "text-white font-medium hover:text-gray-200 transition duration-300", children: "Admin Panel" }), _jsx(Link, { to: "/products", className: "text-white sm:text- font-medium hover:text-gray-200 transition duration-300", children: "View Products" })] })] }) }));
}
export default Navbar;
