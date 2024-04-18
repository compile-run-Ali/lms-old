import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  show: false,
};

export const SidebarContext = createContext(initialState);

export const SidebarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  function setShowSidebar() {
    dispatch({
      type: "TOGGLE_SIDEBAR",
    });
  }
  return (
    <SidebarContext.Provider
      value={{
        showSidebar: state.show,
        setShowSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
