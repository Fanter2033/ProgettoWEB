import React, { createContext, useContext, useState } from "react";

// Crea l'oggetto di contesto
const UserContext = createContext();

export const UserProvider = ({ children }) => {

  // Oggetto condiviso
  const [userGlobal, setUserGlobal] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    isMod: false,
    isSmm: false,
    isUser: true,
  });

  return (
    // Fornisci lo stato globale ai componenti figli
    <UserContext.Provider value={{ userGlobal, setUserGlobal }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  // Usa l'hook per accedere al contesto
  return useContext(UserContext);
};
