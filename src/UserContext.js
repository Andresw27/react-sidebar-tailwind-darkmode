import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase-config';
import fetchUserData from './components/data';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recuperar el usuario de localStorage si está disponible
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      try {
        console.log("userAuth", userAuth);

        if (userAuth) {
          const userData = await fetchUserData(userAuth.uid);
          console.log("userGlobalsssss", userData);
          setUser(userData);
          // Guardar el usuario en localStorage
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.log("No hay usuario autenticado.");
          setUser(null); // Resetea el estado del usuario si no hay autenticación
          // Remover el usuario de localStorage
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    // Limpia el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
