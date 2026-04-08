import React from 'react'
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
   
    const token = !!JSON.parse(localStorage.getItem('authData') || "false");

    console.log(token)

    return token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute