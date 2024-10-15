import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import "./estilos.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
const Header = () => {
  const [headerSidebar, setHeaderSidebar] = useState(false); // Estado del sidebar
  const { nombreEmpresa } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(null);
  const [identificador, setIdentificador] = useState(null); // Para guardar el identificador del usuario
  const iconosRedes = {
    facebook: <FaFacebook className="h-8 w-8" />,
    twitter: <FaTwitter className="h-8 w-8" />,
    instagram: <FaInstagram className="h-8 w-8" />,
    linkedin: <FaLinkedin className="h-8 w-8" />,
    youtube: <FaYoutube className="h-8 w-8" />,
  };
  useEffect(() => {
    const fetchIdentificador = async () => {
      try {
        const q = query(
          collection(db, "usuarios"),
          where("nombreEmpresa", "==", nombreEmpresa)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const userData = firstDoc.data();
          setIdentificador(firstDoc.id); // Guardar el identificador encontrado
        } else {
          setError("No se encontró ninguna empresa con ese nombre.");
        }
      } catch (error) {
        console.error("Error al buscar el identificador:", error);
        setError("Hubo un error al obtener el identificador.");
      }
    };

    if (nombreEmpresa) {
      fetchIdentificador();
    }
  }, [nombreEmpresa]);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!identificador) return; // Esperamos hasta que tengamos el identificador

      try {
        const menuCollectionRef = collection(
          db,
          "config",
          identificador,
          "landing"
        );
        const menuDocsSnap = await getDocs(menuCollectionRef);

        if (!menuDocsSnap.empty) {
          const firstDoc = menuDocsSnap.docs[0];
          setMenuData(firstDoc.data());
        } else {
          setError("No se encontraron documentos en la subcolección 'landing'");
        }
      } catch (error) {
        setError("Hubo un error al obtener los datos del menú");
      }
    };

    if (identificador) {
      fetchMenuData();
    }
  }, [identificador]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!menuData) {
    return <p></p>;
  }

  return (
    <header className="site-header bg-black main-bar-wraper top-0 left-0 w-full z-[800] ">
      <div className="main-bar">
        <div className="container flex justify-between items-center">
          {/* Logo Header */}
          <div className="logo-header w-[180px] h-[75px] relative flex">
            <Link to={`/${nombreEmpresa}`} className="anim-logo">
              <div className="h-full w-auto">
                {menuData.logo && (
                  <img
                    src={menuData.logo}
                    className="object-contain h-full"
                    alt="Logo"
                  />
                )}
              </div>
            </Link>
          </div>

          {/* Botón Sidebar */}
          <button
            type="button"
            className={`togglebtn block w-[45px] h-[45px] rounded-full z-[1100] relative ${
              // z-[1100] asegura que esté por encima del fondo
              headerSidebar ? "open" : ""
            }`}
            onClick={() => {
              setHeaderSidebar(!headerSidebar);
            }}
          >
            <span className={`bar1 ${headerSidebar ? "rotate1" : ""}`}></span>
            <span className={`bar2 ${headerSidebar ? "opacity0" : ""}`}></span>
            <span className={`bar3 ${headerSidebar ? "rotate2" : ""}`}></span>
          </button>
        </div>

        {/* Fondo semitransparente cuando el menú lateral está abierto */}
        {headerSidebar && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[900]"
            onClick={() => setHeaderSidebar(false)} // Cierra el sidebar si se hace clic en el fondo
          ></div>
        )}

        {/* Sidebar (menu lateral) */}
        <div
          className={`header-sidebar fixed top-0 left-0 bg-white w-[240px] md:w-[280px] h-full shadow-lg z-[1000] transform duration-300 ${
            headerSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="sidebar-content min-h-screen px-5 bg-black">
            {/* Logo en el Sidebar */}
            {menuData.logo && (
              <Link to={`/${nombreEmpresa}`}>
                <img
                  src={menuData.logo}
                  className="h-auto w-auto mb-4"
                  alt="Logo"
                />
              </Link>
            )}

            {/* Links del menú */}
            {menuData.botones &&
              menuData.botones.map((link, index) => (
                <ul key={index}>
                  <li className="mb-2 border-b-[1.5px] border-white p-2">
                    <Link to={link.href}>
                      <span className="text-white">{link.nombre}</span>
                    </Link>
                  </li>
                </ul>
              ))}

            {/* Redes Sociales */}
            <div className="social-links mt-10 flex flex-col items-center justify-center gap-4">
              <p className="text-white text-base">Síguenos En</p>
              <div className="flex justify-center gap-4 mt-2">
                {menuData.redesSociales &&
                  menuData.redesSociales.map((social, index) =>
                    social.href ? (
                      <div key={index} className="bg-white p-2 rounded-full">
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {iconosRedes[social.icon]}
                        </a>
                      </div>
                    ) : null
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
