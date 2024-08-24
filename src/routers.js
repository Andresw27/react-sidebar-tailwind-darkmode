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
import ValidarPuntos from "./pages/AdminPuntosEspecial"
import app from "./firebase-config";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData } from "./components/redux/slices/userData";
import { doc, onSnapshot } from "firebase/firestore";
import Logo from "./assets/jeicy.png"
import { db } from "./firebase-config";
const Routers = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      if (user) {
        setUser(user);
        dispatch(setUserData({ uid: user.uid }));
      } else {
        setUser(null);
        dispatch(clearUserData());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUserLoading(true);
      const userDocRef = doc(db, 'usuarios', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
        if (userDocSnap.exists()) {
          const dataUser = userDocSnap.data();
          console.log(dataUser,"holass")
          dispatch(setUserData({
            PuntosporValor: dataUser.PuntosporValor,
            uid: user.uid,
            nombreEmpresa: dataUser.nombreEmpresa,
            nit: dataUser.nit,
            naceptado: dataUser.naceptado,
            nrechazado: dataUser.nrechazado,
            telefono: dataUser.telefono,
            direccion: dataUser.direccion,
            role: dataUser.role,
            nentregado: dataUser.nentregado,
            nombre: dataUser.nombre,
            ndistribucion: dataUser.ndistribucion,
            idBot: dataUser.idBot,
            valorMinimo: dataUser.valorMinimo,
            identificador: dataUser.identificador,
            correo: dataUser.correo,
            password: dataUser.password,
            webhook: dataUser.webhook,
            npremioentregado:dataUser.npremioentregado,
            ncancelado:dataUser.ncancelado
          }));
        } else {
          console.log('No such document!');
        }
        setUserLoading(false);
      }, (error) => {
        console.error('Error al obtener datos de usuario:', error);
        setUserLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, dispatch]);

  const { uidUser } = useSelector(state => state.user);

  if (authLoading || userLoading) {
    return (
      <div className="bg-blue">
        <div className='flex items-center justify-center h-screen bg-black'>
          <div className='flex items-center justify-center gap-2'>
            <img src={Logo} alt="logo" className='h-100 w-100 invert' />
          </div>
        </div>
      </div>
    );
  }

  const NotFound = () => (
    <div className="h-screen bg-black justify-center flex items-center">
      <h1 className="text-white text-center text-6xl">
        404 - Página no encontrada
      </h1>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {user ? (
          <>
            <Route path="/Ordenes" element={<Home />} />
            <Route path="/inicioo" element={<HomeA />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/users" element={<Users />} />
            <Route path="/perfil" element={<UserPerfil />} />
            <Route path="/redimirPuntos" element={<RedimirPuntos />} />
            <Route path="/Usuarios" element={<Clientes />} />
            <Route path="/puntos" element={<AdminPuntos />} />
            <Route path="/validarpuntos" element={<ValidarPuntos />} />
            <Route path="/productos" element={<Productos />} />
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default Routers;