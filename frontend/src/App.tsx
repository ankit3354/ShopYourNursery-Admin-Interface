import Home from "./components/Page/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlantsAdmin from "./components/PlantsAdmin/PlantsAdmin";
import ShowAllPlantsAdmin from "./components/ShowAllPlants/ShowAllPlants";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<PlantsAdmin />} />
        <Route path="/admin/:id" element={<PlantsAdmin />} /> 
        <Route path="/products" element={<ShowAllPlantsAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
