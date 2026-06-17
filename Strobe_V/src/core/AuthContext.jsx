import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    (() => {
      try {
        return JSON.parse(localStorage.getItem("authData") || "null");
      } catch {
        return null;
      }
    })()
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authData");
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("authData", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

