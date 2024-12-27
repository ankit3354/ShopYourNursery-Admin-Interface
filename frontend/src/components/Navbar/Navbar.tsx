import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-[#7AA363] fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center p-4">
        <h1 className="text-white text-2xl font-bold">Shopyounursery</h1>
        <div className="flex flex-wrap justify-center space-x-4">
          <Link
            to="/"
            className="text-white font-medium hover:text-gray-200 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/admin"
            className="text-white font-medium hover:text-gray-200 transition duration-300"
          >
            Admin Panel
          </Link>
          <Link
            to="/products"
            className="text-white sm:text- font-medium hover:text-gray-200 transition duration-300"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
