import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";
import fetchUserData from "../components/data";
import app from "../firebase-config";
import Logo from "../assets/jeicy.png";
import { auth } from "../firebase-config";
import { UserContext } from "../UserContext";
function PerfilUser() {
  const [users, setUsers] = useState([]);
  const user = useContext(UserContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAuth = auth.currentUser;
        console.log("userAuth", userAuth);

        if (userAuth) {
          const userData = await fetchUserData(userAuth.uid);
          console.log("userDatassss", userData);
          setUsers(userData);
        } else {
          console.log("No hay usuario autenticado.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [auth]);
  return (
    <Layout>
      <div className="my-3 mx-10">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Mi perfil
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-6">
        <div className=" border shadow-xs dark:bg-slate-600 flex flex-col w-auto mb-12 px-6 rounded-2xl md:col-span-1">
          <div className="flex flex-col justify-center items-center">
            <img
              className="inline-block h-24  w-24 rounded-full mt-4"
              src={Logo}
              alt="Profile"
            />
            <label
              htmlFor="profileImgInput"
              className="mt-2 text-blue-500 cursor-pointer"
            >
              Change Image
            </label>
            <input
              id="profileImgInput"
              type="file"
              accept="image/*"
              // onChange={handleImageChange}
              className="hidden"
            />
            <div>
              <p className="text-2xl  font-semibold mt-2 ">
                {user.nombreEmpresa}
              </p>
            </div>
          </div>

          <div className="my-10 flex flex-col gap-4">
            <div className="flex flex-col gap-1 bg-emerald-100 bg-opacity-30 backdrop-blur-sm  p-2 border rounded-2xl">
              <p className="text-1xl text-zinc-500 font-semibold dark:text-white">
                Correo
              </p>

              <div>
                <p className="text-1xl text-zinc-400 dark:text-white">
                  {user.correo}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 bg-emerald-100 bg-opacity-30 backdrop-blur-sm  p-2 border rounded-2xl">
                <p className="text-1xl text-zinc-500 font-semibold dark:text-white">
                  Password
                </p>
                <p className="text-1xl text-zinc-400 dark:text-white">
                  {user.password}
                </p>
                <div>
                  {/* <button
                      id="dropdownMenuIconButton"
                      onClick={handleDropdownToggle}
                      data-dropdown-toggle="dropdownDots"
                      className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      type="button"
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 4 15"
                      >
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                    </button> */}
                  {/* {dropdownOpen && (
                      <div
                        id="dropdownDots"
                        className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600  absolute md:top-120 md:left-auto"
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownMenuIconButton"
                        >
                          <li>
                            <button
                              data-modal-target="authentication-modal"
                              onClick={handleModal}
                              data-modal-toggle="authentication-modal"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Update Password
                            </button>
                          </li>
                        </ul>
                      </div>
                    )} */}
                  {/* {dropdownOpenModal && (
                      <div
                        id="authentication-modal"
                        tabIndex="-1"
                        aria-hidden={!dropdownOpenModal}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
                      >
                        <div className="fixed inset-0 bg-darkGray opacity-60"></div>
                        <div className="relative p-4 w-full max-w-md max-h-full">
                          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                              <h3 className="text-title font-semibold text-black dark:text-white">
                                Update Password
                              </h3>
                              <button
                                type="button"
                                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={handleModal}
                              >
                                <svg
                                  className="w-3 h-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="p-4 md:p-5">
                              <form className="space-y-4" action="#">
                                <div>
                                  <label
                                    htmlFor="New Password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    New Password
                                  </label>
                                  <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="*********"
                                    required
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Confirm password
                                  </label>
                                  <input
                                    type="password"
                                    name="password"
                                  
                                    placeholder="*********"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                  Update
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 mb-12 border rounded-2xl flex justify-center items-center flex-col gap-6">
          <div className="-mx-3 md:flex mb-6 ">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Nombre Usuario
              </label>
              <input
                className="appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm   text-grey-darker border border-red rounded py-3 px-4 mb-3"
                id="namepersonal"
                disabled
                type="text"
                value={user.nombre}
              />
            </div>
            <div className="md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Nombre Empresa{" "}
              </label>
              <input
                className="appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm   text-grey-darker border border-grey-lighter rounded py-3 px-4"
                id="Lastname"
                disabled
                type="text"
                value={user.nombreEmpresa}
              />
            </div>
          </div>

          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Correo Electronico
              </label>
              <input
                className="appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm   text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                disabled
                type="text"
                value={user.correo}
              />
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Número Telefono
              </label>
              <input
                className="appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm   text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                id="email"
                type="email"
                disabled
                required
                Value={user.telefono}
              />
            </div>
          </div>
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Dirección
              </label>
              <input
                className="appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm   text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                id="timeZone"
                disabled
                type="text"
                value={user.direccion}
              />
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Nit
              </label>
              <input
                className="appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm   text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                id="timezone"
                type="number"
                disabled
                required
                value={user.nit}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PerfilUser;
