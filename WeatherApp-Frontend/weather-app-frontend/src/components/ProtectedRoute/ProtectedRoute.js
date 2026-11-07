import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../Context/applicationContext";

// Only renders its children for a logged-in user; otherwise sends them to /login.
const ProtectedRoute = ({ children }) => {
  const { getSession } = useContext(AppContext);
  return getSession() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
