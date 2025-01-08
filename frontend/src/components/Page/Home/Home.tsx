import indoor from "../../../assets/indoor.png";
import gardeningTools from "../../../assets/gardening-tool.png";
import outdoor from "../../../assets/outdoor.png";

function Home() {
  return (
    <div className="bg-green-100 w-full h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl text-green-700 font-bold mb-4">
        Welcome to Shopyounursery
      </h1>
      <p className="text-lg text-green-600 mb-8 text-center">
        Your one-stop shop for all your plant nursery needs. Explore our wide
        range of plants, gardening tools, and accessories.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
          <img
            src={indoor}
            alt="Indoor Plants"
            className="w-full h-45 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-semibold text-green-700">
            Indoor Plants
          </h2>
          <p className="text-green-600">
            Bring the beauty of nature indoors with our selection of indoor
            plants.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
          <img
            src={outdoor}
            alt="Outdoor Plants"
            className="w-full h-45 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-semibold text-green-700">
            Outdoor Plants
          </h2>
          <p className="text-green-600">
            Enhance your garden with our variety of outdoor plants.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
          <img
            src={gardeningTools}
            alt="Gardening Tools"
            className="w-full h-45 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-semibold text-green-700">
            Gardening Tools
          </h2>
          <p className="text-green-600">
            Find the best tools to help you maintain your garden.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
