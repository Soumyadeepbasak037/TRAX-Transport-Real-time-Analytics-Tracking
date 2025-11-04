import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <h2>403 - Forbidden</h2>;

  return children;
};

export default ProtectedRoute;
