import React, { createContext, useState, useContext } from 'react';

const HelperContext = createContext();

export const HelperProvider = ({ children }) => {
  const [helpers, setHelpers] = useState([]);
  const [user, setUser] = useState({ username: '', starsEarned: 0 });

  return (
    <HelperContext.Provider value={{ helpers, setHelpers, user, setUser }}>
      {children}
    </HelperContext.Provider>
  );
};

export const useHelperContext = () => useContext(HelperContext);
