import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import Registerform from "./pages/Registration";
import PassengerPage from "./pages/PassengerDashboard";
import Home from "./pages/Home";

export default function App() {
  return (
     <Routes>
      <Route path="/" element={<Home />} />                
      <Route path="/login" element={<Login/>} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/driver" element={<DriverDashboard />} />
      <Route path="/register" element={<Registerform />} />
      <Route path="/passenger" element={<PassengerPage />} />
    </Routes>
  );
}
