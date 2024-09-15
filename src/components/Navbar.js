import React, { useState, useRef, useEffect } from "react";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { MdDateRange } from "react-icons/md";
import { FaRegEdit, FaRegClock } from "react-icons/fa";

const Navbar = ({ setLoading }) => {
  const navigate = useNavigate();
  const { nombre, correo, nombreEmpresa ,logo} = useSelector(state => state.user);
  const [fecha, setFecha] = useState(new Date());


  // Nombres de los meses en español
  const nombresMeses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Función para actualizar la fecha y hora
  const actualizarReloj = () => {
    setFecha(new Date());
  };

  // Use effect para actualizar la fecha cada segundo
  useEffect(() => {
    const intervalo = setInterval(actualizarReloj, 1000);
    return () => clearInterval(intervalo); // Limpiar el intervalo al desmontar el componente
  }, []);

  // Obtener partes de la fecha y hora
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const año = fecha.getFullYear();
  let horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const segundos = fecha.getSeconds().toString().padStart(2, "0");

  // Convertir a formato de 12 horas y AM/PM
  const ampm = horas >= 12 ? "PM" : "AM";
  horas = horas % 12;
  horas = horas ? horas : 12; // El 0 debe ser 12
  const horasFormateadas = horas.toString().padStart(2, "0");

  // Formatear la fecha y la hora
  const nombreMes = nombresMeses[mes];
  const fechaCompleta = `${dia} de ${nombreMes} del año ${año}`;
  const horaActual = `Hora Actual: ${horasFormateadas}:${minutos}:${segundos} ${ampm}`;
  // Ref for the dropdown menu container
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Attach event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white top-0 left-0 p-4 dark:bg-gray-800">
      <div className=" flex justify-end gap-2 items-center mx-auto pt-3">
      
       
      <div className="flex gap-4">
            <div className="flex justify-center gap-2 items-center bg-slate-50  p-3 rounded-full">
              <MdDateRange className="text-2xl"/>
              <p className="text-base font-normal text-gray-500 whitespace-nowrap">
                {fechaCompleta}
              </p>
            </div>
            <div className="flex justify-center gap-2 items-center bg-slate-50  p-3 rounded-full">
              <FaRegClock className="text-2xl" />
              <p className="text-base font-normal text-gray-500 whitespace-nowrap">
                {horaActual}
              </p>
            </div>
          </div>
        <div className="flex justify-end pr-4">
          <button
            id="dropdownAvatarNameButton"
            onClick={handleDropdownToggle}
            className="flex gap-2 items-center bg-black p-2 text-sm pe-1 font-medium text-white rounded-full dark:hover:text-blue-500 md:me-0 dark:focus:ring-gray-700 dark:text-white"
            type="button"
          >
            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={logo} alt="Logo"/>

            <p className="">{nombreEmpresa}</p>
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div
            ref={dropdownRef}
              id="dropdownAvatarName"
              className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute right-15 mt-14"
            >
              <div className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                <div className="truncate">{correo}</div>
              </div>

              <div className="py-2">
                <Link to="/perfil">
                  <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">
                    Mi perfil
                  </span>
                </Link>
                <span
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                >
                  Cerrar Sesión
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
