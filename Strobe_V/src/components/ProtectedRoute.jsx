import React from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../core/AuthContext";

const ProtectedRoute = () => {
  const { currentUser } = React.useContext(AuthContext);

  const isAuthenticated = !!currentUser;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute
