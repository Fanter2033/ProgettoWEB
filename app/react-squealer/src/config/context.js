import React, { createContext, useContext, useState } from "react";

// Crea l'oggetto di contesto
const MyContext = createContext();

export const MyProvider = ({ children }) => {
  // Definisci lo stato globale o qualsiasi altra logica condivisa
  const [userGlobal, setUserGlobal] = useState(
    
  );

  return (
    // Fornisci lo stato globale ai componenti figli
    <MyContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  // Utilizza il hook useContext per accedere al contesto
  return useContext(MyContext);
};
