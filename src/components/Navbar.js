import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase-config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { UserContext } from "../UserContext"; // Asegúrate de ajustar la ruta correcta

const Navbar = ({ setLoading }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      console.log("Sesion finalizada");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-white top-0 left-0 w-auto p-4 dark:bg-gray-800">
      <div className="container flex justify-between items-center mx-auto pt-3">
        <div className="flex items-center mx-auto justify-end"></div>
        <div className="flex justify-end pr-4">
          {user && (
            <button
              id="dropdownAvatarNameButton"
              onClick={handleDropdownToggle}
              className="flex gap-2 items-center text-sm pe-1 font-medium text-gray-900 rounded-full dark:hover:text-blue-500 md:me-0 dark:focus:ring-gray-700 dark:text-white"
              type="button"
            >
              {/* <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={ImgProfile} alt="Logo"/> */}
              <p className="">{user.nombreEmpresa}</p>
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
          )}

          {dropdownOpen && user && (
            <div
              id="dropdownAvatarName"
              className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute right-15 mt-9"
            >
              <div className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                <div className="truncate">{user.correo}</div>
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
