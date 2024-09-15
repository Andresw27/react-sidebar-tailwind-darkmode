import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";
import fetchUserData from "../components/data";
import app from "../firebase-config";
// import Logo from "../assets/jeicy.png";
import { auth, updateProfile } from "../firebase-config";
import { UserContext } from "../UserContext";
import { useSelector } from "react-redux";
import { FaUserEdit } from "react-icons/fa";
import Alert from "../components/Alert";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const LoadingSplash = () => {
  return (
    <div style={splashStyle}>
      <p className="text-2xl">Guardando Cambios.......</p>
    </div>
  );
};

const splashStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo semi-transparente
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000, // Asegura que esté por encima de otros elementos
};

function PerfilUser() {
  const [users, setUsers] = useState([]);
  const {
    nombreEmpresa,
    correo,
    password,
    nombre,
    telefono,
    direccion,
    nit,
    logo,
    Rinstagram,
    Rfacebook,
    Rtiktok,
  } = useSelector((state) => state.user);

  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(logo || "");
  const [editable, setEditable] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [NOMBRE, setNOMBRE] = useState("");
  const [NombreEmpresa, setNombreEmpresa] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Nit, setNit] = useState("");
  const [RTiktok, setRTiktok] = useState("");
  const [RInstagram, setRInstagram] = useState("");
  const [RFacebook, setRFacebook] = useState("");

  const handleEditClick = (
    nombre,
    nombreEmpresa,
    telefono,
    direccion,
    nit,
    Rinstagram,
    Rtiktok,
    Rfacebook
  ) => {
    setEditable(!editable);
    setNOMBRE(nombre);
    setNombreEmpresa(nombreEmpresa);
    setTelefono(telefono);
    setDireccion(direccion);
    setNit(nit);
    setRInstagram(Rinstagram);
    setRTiktok(Rtiktok);
    setRFacebook(Rfacebook);
    console.log(nombre,
      nombreEmpresa,
      telefono,
      direccion,
      nit,
      Rinstagram,
      Rtiktok,
      Rfacebook, "nombreew");
  };

  const handleCancelClick = () => {
    setEditable(false);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storage = getStorage();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) {
      setError("No user is signed in");
      return;
    }

    const storageRef = ref(storage, `profileImages/${user.uid}`);
    setIsUploading(true);

    try {
      // Subir el archivo a Firebase Storage
      await uploadBytes(storageRef, file);

      // Obtener la URL de la imagen subida
      const newPhotoURL = await getDownloadURL(storageRef);

      // Actualizar el perfil del usuario en Firebase Auth
      await updateProfile(user, { photoURL: newPhotoURL });

      // Actualizar el campo 'logo' en la base de datos Firestore
      const userDocRef = doc(db, "usuarios", user.uid); // Suponiendo que tienes una colección 'users'
      await updateDoc(userDocRef, { logo: newPhotoURL });

      // Actualizar el estado local para mostrar la nueva imagen
      setPhotoURL(newPhotoURL);

      console.log("Profile photo and database updated successfully!");
    } catch (err) {
      setError(err.message);
      console.error("Error updating profile photo and database:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveClick = async () => {
    if (editable) {
      setisLoading(true);
      try {
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
          const userDocRef = doc(db, "usuarios", user.uid);
          await updateDoc(userDocRef, {
            nombre: NOMBRE,
            telefono:Telefono,
            direccion:Direccion,
            nombreEmpresa:NombreEmpresa,
            nit:Nit,
            Rtiktok:RTiktok,
            Rfacebook:RFacebook,
            Rinstagram:RInstagram
          });
          console.log("User information updated successfully!");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error updating user information:", err);
      }
    }
    setisLoading(false);
    setEditable(false);
    setShowAlert(true);
    setAlertMessage("Información Actualizada Con exito");
  };

  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      {showErrorAlert && (
        <Alert
          message={alertMessage}
          type="error"
          onClose={() => setShowErrorAlert(false)}
        />
      )}
      {isLoading && <LoadingSplash />}
      <div className="my-3 mx-10">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Mi perfil
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-6">
        <div className=" border shadow-xs dark:bg-slate-600 flex flex-col w-auto mb-12 px-6 rounded-2xl md:col-span-1">
          <div className="flex flex-col justify-center items-center">
            <div
              className={`image-container ${isUploading ? "uploading" : ""}`}
            >
              <img
                className={`inline-block h-24 w-24 rounded-full mt-4 ${
                  isUploading ? "gray-out blur-sm" : ""
                }`}
                src={photoURL}
                alt="Profile"
              />
              {isUploading && (
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              )}
            </div>

            <label
              htmlFor="profileImgInput"
              className={
                isUploading ? "hidden" : `mt-2 text-blue-500 cursor-pointer`
              }
            >
              Actualizar Imagen
            </label>
            <input
              id="profileImgInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {isUploading && <p className="mt-2">Subiendo Imagen...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <p className="text-2xl  font-semibold mt-2 ">{nombreEmpresa}</p>
            </div>
          </div>

          <div className="my-10 flex flex-col gap-4">
            <div className="flex flex-col gap-1 bg-emerald-100 bg-opacity-30 backdrop-blur-sm  p-2 border rounded-2xl">
              <p className="text-1xl text-zinc-500 font-semibold dark:text-white">
                Correo
              </p>

              <div>
                <p className="text-1xl text-zinc-400 dark:text-white">
                  {correo}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 bg-emerald-100 bg-opacity-30 backdrop-blur-sm  p-2 border rounded-2xl">
                <p className="text-1xl text-zinc-500 font-semibold dark:text-white">
                  Password
                </p>
                <p className="text-1xl text-zinc-400 dark:text-white">
                  {password}
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

        <div className="col-span-2 mb-12 border rounded-2xl flex justify-center flex-col gap-6">
          <div className="flex justify-end items-center gap-2 mr-4">
            {!editable ? (
              <span
                className="bg-black flex justify-end items-center gap-2 p-3 rounded-full cursor-pointer"
                onClick={() => handleEditClick(nombre,
                  nombreEmpresa,
                  telefono,
                  direccion,
                  nit,
                  Rinstagram,
                  Rtiktok,
                  Rfacebook)}
              >
                <FaUserEdit className="text-2xl text-white" />
                <p className="text-base text-white font-medium">
                  Editar Información
                </p>
              </span>
            ) : (
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white p-3 rounded-full cursor-pointer"
                  onClick={handleSaveClick}
                >
                  Guardar Cambios
                </button>

                <button
                  className="bg-red-500 text-white p-3 rounded-full cursor-pointer"
                  onClick={handleCancelClick}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
          <div className="mx-4 md:flex mb-1">
            <div className="md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="namepersonal"
              >
                Nombre Usuario
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="namepersonal"
                type="text"
                value={!editable ? nombre : NOMBRE}
                onChange={(e) => setNOMBRE(e.target.value)}
                disabled={!editable}
              />
            </div>
            <div className="md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="Lastname"
              >
                Nombre Empresa
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="Lastname"
                type="text"
                value={!editable ? nombreEmpresa : NombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                disabled={!editable}
              />
            </div>
            <div className="md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="email"
              >
                Correo Electrónico
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                type="text"
                value={correo}
                disabled
              />
            </div>
          </div>

          <div className="mx-4 md:flex mb-1">
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="telefono"
              >
                Número Teléfono
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="telefono"
                type="text"
                value={!editable ? telefono : Telefono}
                onChange={(e) => setTelefono(e.target.value)}
                disabled={!editable}
              />
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="direccion"
              >
                Dirección
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="direccion"
                type="text"
                value={!editable ? direccion : Direccion}
                onChange={(e) => setDireccion(e.target.value)}
                disabled={!editable}
              />
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="nit"
              >
                Nit
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="nit"
                type="number"
                value={!editable ? nit : Nit}
                onChange={(e) => setNit(e.target.value)}
                disabled={!editable}
              />
            </div>
          </div>

          <div className="mx-4 md:flex mb-1">
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="Rinstagram"
              >
                Instagram
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="Rinstagram"
                type="text"
                value={!editable ? Rinstagram : RInstagram}
                onChange={(e) => setRInstagram(e.target.value)}
                disabled={!editable}
              />
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="Rfacebook"
              >
                Facebook
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="Rfacebook"
                type="text"
                value={!editable ? Rfacebook : RFacebook}
                onChange={(e) => setRFacebook(e.target.value)}
                disabled={!editable}
              />
            </div>
            <div className="md:w-full px-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="Rtiktok"
              >
                Tik tok
              </label>
              <input
                className={
                  editable
                    ? "appearance-none block w-full  bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    : "appearance-none block w-full bg-emerald-100 bg-opacity-30 backdrop-blur-sm text-grey-darker border border-red rounded py-3 px-4 mb-3"
                }
                id="Rtiktok"
                type="text"
                value={!editable ? Rtiktok : RTiktok}
                onChange={(e) => setRTiktok(e.target.value)}
                disabled={!editable}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PerfilUser;
