import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Home from "./components/Page/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlantsAdmin from "./components/PlantsAdmin/PlantsAdmin";
import ShowAllPlantsAdmin from "./components/ShowAllPlants/ShowAllPlants";
function App() {
    return (_jsxs(Router, { children: [_jsx(Navbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/admin", element: _jsx(PlantsAdmin, {}) }), _jsx(Route, { path: "/admin/:id", element: _jsx(PlantsAdmin, {}) }), _jsx(Route, { path: "/products", element: _jsx(ShowAllPlantsAdmin, {}) })] })] }));
}
export default App;
