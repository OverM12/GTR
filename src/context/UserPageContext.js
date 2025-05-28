// contexts/UserPageContext.js
"use client";
import React, { createContext, useState, useContext } from "react";

const UserPageContext = createContext();

export const UserPageProvider = ({ children }) => {
  const [paginatedUsers, setPaginatedUsers] = useState([]);

  return (
    <UserPageContext.Provider value={{ paginatedUsers, setPaginatedUsers }}>
      {children}
    </UserPageContext.Provider>
  );
};

export const useUserPage = () => useContext(UserPageContext);
