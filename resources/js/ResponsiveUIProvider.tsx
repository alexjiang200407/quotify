import React, { createContext, useContext } from "react";

const IsMobileContext = createContext<boolean>(window.innerWidth < 1000)

export const isMobileDevice = () => useContext(IsMobileContext)
