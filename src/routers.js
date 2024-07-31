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
import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData } from "./components/redux/slices/userData";
import { doc, onSnapshot } from "firebase/firestore";
import Logo from "./assets/jeicy.png"
import { db } from "./firebase-config";

const Routers = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [rol,setRol]=useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log('user uid', user.uid);
        dispatch(setUserData({
          uid: user.uid
        }));
        console.log("este es el usuario", user);
      } else {
        setUser(null);
        dispatch(clearUserData());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const fetchUserData = () => {
    if (!user) return;
    const userDocRef = doc(db, 'usuarios', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
      if (userDocSnap.exists()) {
        const dataUser = userDocSnap.data();
        console.log("la data uSers:", dataUser);

        setRol(dataUser.role);
        dispatch(setUserData({
          PuntosporValor: dataUser.PuntosporValor,
          uid: user.uid,
          nombreEmpresa: dataUser.nombreEmpresa,
          nit: dataUser.nit,
          naceptado: dataUser.naceptado,
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
          password: dataUser.password
        }));

      } else {
        console.log('No such document!');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error al obtener datos de usuario:', error);
      setLoading(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      const unsubscribe = fetchUserData();
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } 
  }, [user, dispatch]);

  const { uidUser } = useSelector(state => state.user);

  console.log(uidUser);

  if (loading) {
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

  const NotFound = () => {
    return (
      <div className="h-screen bg-black justify-center flex items-center">
        <h1 className="text-white text-center text-6xl">
          404 - Página no encontrada
        </h1>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {user ? (
          <>
            <Route path="/inicio" element={<Home />} />
            <Route path="/inicioo" element={<HomeA />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/users" element={<Users />} />
            <Route path="/perfil" element={<UserPerfil />} />
            <Route path="/redimirPuntos" element={<RedimirPuntos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/puntos" element={<AdminPuntos />} />
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
