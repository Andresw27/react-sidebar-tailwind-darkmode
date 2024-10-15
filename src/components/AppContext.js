import React, { createContext, useState } from "react";

const defaultState = {
  headerClass: false,
  setHeaderClass: () => {},
  showSignInForm: false,
  setShowSignInForm: () => {},
  showCategeryFilter: false,
  setShowCategeryFilter: () => {},
  showSidebar: false,
  setShowSidebar: () => {},
  headerSidebar: false,
  setHeaderSidebar: () => {
    document.body.style.overflow = 'hidden';
  },
};

export const Context = createContext(defaultState);

export const AppContextProvider = ({ children }) => {
  const [headerClass, setHeaderClass] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showCategeryFilter, setShowCategeryFilter] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [headerSidebar, setHeaderSidebar] = useState(false);

  const contextValue = {
    headerClass,
    setHeaderClass,
    showSignInForm,
    setShowSignInForm,
    showCategeryFilter,
    setShowCategeryFilter,
    showSidebar,
    setShowSidebar,
    headerSidebar,
    setHeaderSidebar,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
