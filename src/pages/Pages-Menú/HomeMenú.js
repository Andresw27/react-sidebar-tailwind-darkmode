import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import Logo from '../../assets/logo.png';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
const HomeMenu = () => {
  const { nombreEmpresa } = useParams(); // Obtenemos el nombreEmpresa desde la URL
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading inicial
  const [showMenuLoading, setShowMenuLoading] = useState(false); // Loading secundario
  const [error, setError] = useState(null);
  const [identificador, setIdentificador] = useState(null); // Para almacenar el identificador del usuario
  const iconosRedes = {
    facebook: <FaFacebook className="h-8 w-8" />,
    twitter: <FaTwitter className="h-8 w-8" />,
    instagram: <FaInstagram className="h-8 w-8" />,
    linkedin: <FaLinkedin className="h-8 w-8" />,
    youtube: <FaYoutube className="h-8 w-8" />,
  };
  useEffect(() => {
    const fetchIdentificadorByEmpresa = async () => {
      try {
        // Buscar el documento donde el campo 'nombreEmpresa' coincida
        const usersCollectionRef = collection(db, "usuarios"); // O donde almacenes los usuarios/empresas
        const q = query(usersCollectionRef, where("nombreEmpresa", "==", nombreEmpresa));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Obtenemos el identificador del primer documento encontrado
          const firstDoc = querySnapshot.docs[0];
          const userIdentificador = firstDoc.id; // El id del documento será el identificador
          setIdentificador(userIdentificador); // Guardamos el identificador para usarlo más adelante
        } else {
          setError("No se encontró ningún usuario con ese nombre de empresa.");
        }
      } catch (error) {
        console.error("Error al buscar el identificador:", error);
        setError("Hubo un error al buscar el usuario.");
      }
    };

    if (nombreEmpresa) {
      fetchIdentificadorByEmpresa();
    }
  }, [nombreEmpresa]);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!identificador) return; // Esperamos tener el identificador

      try {
        // Accedemos a la colección 'landing' usando el identificador obtenido
        const menuCollectionRef = collection(db, "config", identificador, "landing");
        const menuDocsSnap = await getDocs(menuCollectionRef);

        if (!menuDocsSnap.empty) {
          // Si solo hay un documento, obtenemos el primero
          const firstDoc = menuDocsSnap.docs[0];
          setMenuData(firstDoc.data());
          console.log("Datos del menú:", firstDoc.data());

          // Simulamos un pequeño delay para mostrar el loading del logo del menú
          setTimeout(() => {
            setShowMenuLoading(true);
          }, 1000); // Puedes ajustar el tiempo de retraso
        } else {
          setError("No se encontraron documentos en la subcolección 'landing'.");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("Hubo un error al obtener los datos del menú.");
      } 
      finally {
        setLoading(false); // El loading inicial solo se detiene cuando obtenemos los datos o si ocurre un error
      }
    };

    if (identificador) {
      fetchMenuData();
    }
  }, [identificador]);

  // Primer estado de carga con el logo genérico
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        {/* <img src={Logo} alt="Logo" className="h-48 animate-bounce" /> */}
      </div>
    );
  }

  // Mostrar un error si ocurrió
  if (error) {
    return <div className="text-center text-white bg-black">{error}</div>;
  }

  // Segundo estado de carga con el logo del menuData (loading secundario)
  if (!showMenuLoading && menuData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <img src={menuData.logo } alt="Menu Logo" className="h-48 animate-bounce" />
      </div>
    );
  }

  // Si todo está cargado, mostrar el contenido del menú
  return (
    <>
      <div
        className="dark:text-white top-0 left-0 w-full bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url(${menuData.fondo})`
        }}
      >
        <div className='flex flex-col gap-4'>
          {/* Logo cargado desde menuData o el logo genérico */}
          <div className='flex justify-center md:h-96 h-[150px] w-[320px] md:w-full  '> 
            <img className='h-[150px] md:h-96 object-cover ' src={menuData.logo || Logo} alt="Logo" />
          </div>

          {/* Menu links */}
          <div className='flex flex-col gap-2'>
            {menuData.botones && menuData.botones.map((boton, index) => (
              <a href={boton.href} key={index}>
                <div 
                  className='shadow-none md:w-[450px] w-[100%] rounded-xl py-2 px-4 cursor-pointer '
                  style={{
                    backgroundColor: boton.backgroundColor,
                    borderRadius: boton.borderRadius + 'px'
                  }}
                >
                  <p className='text-center' style={{ color: boton.textColor }}>{boton.nombre}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Redes sociales */}
          <div className='flex justify-center gap-4 mt-2'>
            {menuData.redesSociales && menuData.redesSociales.map((social, index) => (
              social.href ? (
                <div key={index} className='bg-white p-2 rounded-full'>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {iconosRedes[social.icon]}                   </a>
                </div>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeMenu;
