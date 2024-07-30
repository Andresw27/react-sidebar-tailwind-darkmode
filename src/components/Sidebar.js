import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@material-tailwind/react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FaHome, FaHamburger, FaUser } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { auth } from "../firebase-config";
import Logo from "../assets/jeicy.png";
import Logosmall from "../assets/jeicyy.png";
import fetchUserData from "./data";
import HamburgerButton from "./HamburgerMenuButton/HamburgerButton";
import { UserContext } from "../UserContext";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(null);
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [newOrder, setNewOrder] = useState(false); // Estado para el nuevo pedido
const user =useContext(UserContext)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAuth = auth.currentUser;
        console.log("userAuth", userAuth);

        if (userAuth) {
          const userData = await fetchUserData(userAuth.uid);
          console.log("userdatasidebar", userData);
          setUserRole(userData.role);
        } else {
          console.log("No hay usuario autenticado.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  
  const Menus = [
    {
      title: "Inicio",
      path: "/inicio",
      src: <FaHome />,
      activeSrc: <FaHome />,
      roles: ["Usuario"], 
    },
    {
      title: "Productos",
      path: "/productos",
      src: <FaHamburger />,
      activeSrc: <FaHamburger />,
      roles: ["Usuario"], 

    },
    {
      title: "Usuarios",
      path: "/users",
      src: <FaUser />,
      activeSrc: <FaUser />,
      roles: ["admin"], 
    },
    {
      title: "Clientes y Puntos",
      path: "#",
      src: <RiUserSettingsFill />,
      activeSrc: <RiUserSettingsFill />,
      roles: ["Usuario"], 

      subMenus: [
        {
          title: "Clientes",
          path: "/clientes",
        },
        {
          title: "Administrar Puntos",
          path: "/puntos",
        },
        {
          title: "Redemir Puntos",
          path: "/redimirPuntos",
        },
      ],
    },
  ];

  const handleMenuClick = (menu) => {
    if (menu.subMenus) {
      if (!open) setOpen(true); // Open the sidebar if it's closed
      setSubMenuOpen((prev) => (prev === menu.title ? null : menu.title));
    } else {
      setSubMenuOpen(null); // Close submenu if any other menu item is clicked
      if (mobileMenu) setMobileMenu(false); // Close mobile menu on item click
    }
  };

  const handleSubMenuClick = () => {
    if (mobileMenu) setMobileMenu(false); // Close mobile menu on subitem click
  };

  const toggleSidebar = () => {
    setOpen(!open);
    if (open) setSubMenuOpen(null); // Close any open submenu when sidebar is closed
  };

  return (
    <>
      <div
        className={`${
          open ? "w-60" : "w-fit"
        } hidden sm:block relative h-screen duration-300 transition-all bg-white border-r border-gray-200 dark:border-gray-600 p-5 dark:bg-slate-800`}
      >
        <BsArrowLeftCircle
          className={`${
            !open && "rotate-180"
          } absolute text-3xl bg-white fill-slate-800 rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800 transition-transform duration-300`}
          onClick={toggleSidebar}
        />
        <Link to="/inicio">
          <div className={`flex ${open && "gap-x-4"} items-center`}>
            <img
              src={open ? Logo : Logosmall}
              alt="Logo"
              className={`transition-all duration-300 ${
                open ? "h-20" : "h-16"
              }`}
            />
          </div>
        </Link>

        <ul className="pt-6">
          {Menus.filter(
            (menu) => !menu.roles || menu.roles.includes(userRole)
          ).map((menu, index) => (
            <div key={index}>
              <Link to={menu.path} onClick={() => handleMenuClick(menu)}>
                <li
                  className={`flex items-center gap-x-2 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105 transition duration-100 ease-in-out
                    ${menu.gap ? "mt-9" : "mt-2"} 
                    ${
                      location.pathname === menu.path
                        ? "bg-slate-900 hover:bg-slate-900 text-white"
                        : ""
                    }`}
                >
                  {open ? (
                    <span
                      className={`text-2xl ${
                        location.pathname === menu.path ? "text-white" : ""
                      }`}
                    >
                      {location.pathname.startsWith(menu.path)
                        ? menu.activeSrc
                        : menu.src}
                    </span>
                  ) : (
                    <Tooltip
                      className="mx-4"
                      placement="left-end"
                      content={menu.title}
                    >
                      <span
                        className={`text-2xl ${
                          location.pathname === menu.path ? "text-white" : ""
                        }`}
                      >
                        {location.pathname.startsWith(menu.path)
                          ? menu.activeSrc
                          : menu.src}
                      </span>
                    </Tooltip>
                  )}
                  <span
                    className={`${
                      !open && "hidden"
                    } origin-left duration-300 transition-opacity`}
                  >
                    {menu.title}
                  </span>
                </li>
              </Link>
              {menu.subMenus && subMenuOpen === menu.title && (
                <ul className="pl-8">
                  {menu.subMenus.map((subMenu, subIndex) => (
                    <Link
                      to={subMenu.path}
                      key={subIndex}
                      onClick={handleSubMenuClick}
                    >
                      <li
                        className={`flex items-center gap-x-2 p-2 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105 transition duration-100 ease-in-out
                          ${
                            location.pathname === subMenu.path
                              ? "bg-slate-900 hover:bg-slate-900 text-white"
                              : ""
                          }`}
                      >
                        <span
                          className={`${
                            location.pathname === subMenu.path
                              ? "text-white"
                              : ""
                          }`}
                        >
                          {subMenu.title}
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="pt-3">
        <HamburgerButton
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
        />
      </div>
      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? "flex" : "hidden"
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white bg-gray-50 dark:bg-slate-800 drop-shadow-md rounded-xl`}
        >
          {Menus.filter(
            (menu) => !menu.roles || menu.roles.includes(userRole)
          ).map((menu, index) => (
            <div key={index}>
              <Link to={menu.path} onClick={() => handleMenuClick(menu)}>
                <span
                  className={`${
                    location.pathname === menu.path &&
                    "bg-gray-200 dark:bg-gray-700"
                  } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  {menu.title}
                </span>
              </Link>
              {menu.subMenus && subMenuOpen === menu.title && (
                <ul className="pl-4">
                  {menu.subMenus.map((subMenu, subIndex) => (
                    <Link
                      to={subMenu.path}
                      key={subIndex}
                      onClick={handleSubMenuClick}
                    >
                      <li
                        className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700
                          ${
                            location.pathname === subMenu.path
                              ? "bg-slate-900 text-white"
                              : ""
                          }`}
                      >
                        {subMenu.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
