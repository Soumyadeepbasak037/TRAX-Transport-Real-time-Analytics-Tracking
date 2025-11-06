import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import Registerform from "./pages/Registration";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path = "/driver" element= {<DriverDashboard/>} />
      <Route path="/register" element = {<Registerform/>}/>
    </Routes>
  );
}
