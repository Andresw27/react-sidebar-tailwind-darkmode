import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import HomeA from "./pages/pagesAdmin/homeAdmin";
import Estadisticas from "./pages/Estadisticas";
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import Users from "./pages/pagesAdmin/Users";
import AdminPuntos from "./pages/AdminPuntos";
import Clientes from "./pages/Clientes";
import UserPerfil from "./pages/PerfilUser";
import RedimirPuntos from "./pages/RedimirPuntos";
import app from "./firebase-config";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
const Routers = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const NotFound = () => {
    return (
      <div className="h-screen bg-black justify-center flex items-center">
        <h1 className="text-white text-center text-6xl">
          404 - Página no encontrada
        </h1>
        ;
      </div>
    );
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {user ? (
          <Route>
            <Route path="/inicio" element={<Home />} />
            <Route path="/inicioo" element={<HomeA />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/users" element={<Users />} />
            <Route path="/perfil" element={<UserPerfil />} />
            <Route path="/redimirPuntos" element={<RedimirPuntos />} />

            <Route path="/clientes" element={<Clientes />} />
            <Route path="/puntos" element={<AdminPuntos />} />

            <Route path="/productos" element={<Productos />} />
          </Route>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </Router>
  );
};

export default Routers;
