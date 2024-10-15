import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  updateDoc,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  s,
} from "firebase/storage"; // Firebase Storage
import { db } from "../firebase-config";
import { useSelector } from "react-redux";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
function MenúWeb() {
  const [fondo, setFondo] = useState("");
  const [logo, setLogo] = useState("");
  const [fondoPreview, setFondoPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [botones, setBotones] = useState([]);
  const [currentBoton, setCurrentBoton] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { identificador, nombreEmpresa } = useSelector((state) => state.user);
  const [showModalRedSocial, setShowModalRedSocial] = useState(false);
  const [currentRedSocial, setCurrentRedSocial] = useState(null);
  const [redesSociales, setRedesSociales] = useState([]);
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState("");
  const [DataMenuWeb, setDataMenuWeb] = useState([]);
  const [openmodaleditmenuweb, setopenmodaleditmenuweb] = useState("");
  const [selectEditMenuweb, setselectEditMenuweb] = useState(null);
  const iconosRedes = {
    facebook: <FaFacebook />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedin />,
    youtube: <FaYoutube />,
  };

  // Referencias a los inputs de tipo file
  const fondoInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Abrir el modal para agregar o editar redes sociales
  const openModalRedSocial = (redSocial = null) => {
    setCurrentRedSocial(redSocial);
    setShowModalRedSocial(true);
    console.log(redSocial);
  };

  const closeModalRedSocial = () => {
    setCurrentRedSocial(null);
    setShowModalRedSocial(false);
  };

  const handleSaveRedSocial = () => {
    if (currentRedSocial.id) {
      setRedesSociales(
        redesSociales.map((rs) =>
          rs.id === currentRedSocial.id ? currentRedSocial : rs
        )
      );
    } else {
      setRedesSociales([
        ...redesSociales,
        { ...currentRedSocial, id: Date.now(), icon: currentRedSocial.icon }, // Guardar icon como string
      ]);
    }
    closeModalRedSocial();
  };

  // Manejar los cambios en los valores de las redes sociales
  const handleRedSocialChange = (e) => {
    const { name, value } = e.target;
    setCurrentRedSocial({ ...currentRedSocial, [name]: value });
  };

  // Eliminar una red social
  const handleEliminarRedSocial = (id) => {
    setRedesSociales(redesSociales.filter((rs) => rs.id !== id));
  };

  // Manejar la imagen de fondo
  const handleFondoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFondo(file);
      setFondoPreview(URL.createObjectURL(file)); // Crear URL para vista previa
    }
  };

  // Manejar la imagen del logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file)); // Crear URL para vista previa
    }
  };

  // Abrir el modal para agregar o editar un botón
  const openModal = (boton = null) => {
    setCurrentBoton(boton);
    setShowModal(true);
    console.log(boton);
  };

  // Cerrar el modal
  const closeModal = () => {
    setCurrentBoton(null);
    setShowModal(false);
  };

  // Guardar o actualizar botón
  const handleSaveBoton = () => {
    if (currentBoton.id) {
      // Actualizar botón existente
      setBotones(
        botones.map((boton) =>
          boton.id === currentBoton.id ? currentBoton : boton
        )
      );
    } else {
      // Agregar nuevo botón
      setBotones([...botones, { ...currentBoton, id: Date.now() }]);
    }
    closeModal();
  };

  // Manejar los cambios en los valores de los botones
  const handleBotonChange = (e) => {
    const { name, value } = e.target;
    setCurrentBoton({ ...currentBoton, [name]: value });
  };

  // Eliminar un botón
  const handleEliminarBoton = (id) => {
    setBotones(botones.filter((boton) => boton.id !== id));
  };

  const guardarTodoEnFirebase = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const userQuery = query(
      collection(db, "usuarios"),
      where("identificador", "==", identificador)
    );

    const querySnapshot = await getDocs(userQuery);
    let uidUser = "";
    querySnapshot.forEach((doc) => {
      uidUser = doc.id;
    });

    if (!uidUser) {
      console.error("Usuario no encontrado");
      return;
    }
    try {
      // Subir la imagen de fondo a Firebase Storage
      const fondoUrl = await subirImagen(fondo, "fondos");

      // Subir la imagen del logo a Firebase Storage
      const logoUrl = await subirImagen(logo, "logos");

      // Guardar datos en Firestore
      const docRef = await addDoc(
        collection(db, "config", uidUser, "landing"),
        {
          fondo: fondoUrl, // URL de la imagen subida
          logo: logoUrl, // URL de la imagen subida
          botones: botones, // Array de botones
          redesSociales: redesSociales, // Redes sociales
        }
      );
      setAlertMessage("Menú web configurado con éxito");
      setShowAlert(true);
      setFondo("");
      setLogo("");
      setFondoPreview(null);
      setLogoPreview(null);
      setRedesSociales([]);
      setBotones([]);
      fondoInputRef.current.value = ""; // Limpia el input de fondo
      logoInputRef.current.value = ""; // Limpia el input de logo
      console.log("Datos guardados con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
    }
  };

  // Función auxiliar para subir imágenes a Firebase Storage
  const subirImagen = async (file, nombreEmpresa) => {
    if (!file) return null; // Si no hay archivo, no subas nada
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `ImgProductosmenu/${nombreEmpresa}/${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  };

  const fetchMenuWeb = async () => {
    try {
      const userQuery = query(
        collection(db, "usuarios"),
        where("identificador", "==", identificador)
      );

      const querySnapshot = await getDocs(userQuery);
      let uidUser = "";
      querySnapshot.forEach((doc) => {
        uidUser = doc.id;
      });

      if (!uidUser) {
        console.error("Usuario no encontrado");
        return;
      }

      const userDocRef = collection(db, "config", uidUser, "landing");

      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const menus = [];
        snapshot.forEach((doc) => {
          menus.unshift({ id: doc.id, ...doc.data() });
        });

        setDataMenuWeb(menus);
        console.log("landiweb", menus);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  useEffect(() => {
    fetchMenuWeb();
  }, []);

  const HandleOpenmodalEditMenuweb = (menu) => {
    setopenmodaleditmenuweb(true);
    setselectEditMenuweb(menu);
    console.log(menu, "menu");
  };

  const HandleClosedmodalEditMenuweb = () => {
    setopenmodaleditmenuweb(false);
  };

  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      <div className="my-4 mx-10 flex justify-between">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Configurar Menú Web
        </p>
        {DataMenuWeb.length > 0 ? (
          <>
            {DataMenuWeb.map((menu, index) => (
              <button
                key={index}
                onClick={() => HandleOpenmodalEditMenuweb(menu)}
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Ver menú configurado
              </button>
            ))}

<Modal
  nombre="Editar Menú Web"
  isOpen={openmodaleditmenuweb}
  onClose={HandleClosedmodalEditMenuweb}
  size="auto"
>
  {selectEditMenuweb ? (
    <div
      className="dark:text-white top-0 left-0 w-[400px] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${selectEditMenuweb.fondo || ''})`,
      }}
    >
      <div className="flex flex-col gap-4 text-center">
        <img
          src={selectEditMenuweb.logo || ''}
          alt="Logo"
          className="h-40 w-auto mx-auto"
        />

        <div className="flex flex-col gap-4 text-center">
          {selectEditMenuweb.botones?.map((boton) => (
            <div key={boton.id} className="relative">
              <a
                href={boton.href}
                className="py-2 px-4 inline-block font-semibold text-center"
                style={{
                  backgroundColor: boton.backgroundColor,
                  color: boton.textColor,
                  borderRadius: `${boton.borderRadius}px`,
                  borderWidth: `${boton.borderWidth}px`,
                  borderStyle: "solid",
                }}
              >
                {boton.nombre || "Botón Sin Nombre"}
              </a>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          {selectEditMenuweb.redesSociales?.map((red) => (
            <div className="flex flex-col" key={red.id}>
              <div className="relative p-2 rounded-full flex flex-col items-center">
                <a
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: red.backgroundColor,
                    color: red.ColorIcon,
                  }}
                >
                  <div className="text-3xl">
                    {iconosRedes[red.icon] || <FaFacebook />}
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p> // Optional: you can display a loading message if needed
  )}
</Modal>

          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-6">
        {/* Contenedor con los inputs para las imágenes y botones */}
        <div className="border shadow-xs dark:bg-slate-600 flex flex-col justify-center items-center w-full md:w-auto mb-12 h-auto px-6 py-2 rounded-2xl md:col-span-1">
          {DataMenuWeb.length > 0 ? (
            <>
              <p>Ya no se puede configurar más menús web</p>
            </>
          ) : (
            <>
              <form className="space-y-4" onSubmit={guardarTodoEnFirebase}>
                {/* Input para la imagen de fondo */}
                <div>
                  <label
                    htmlFor="fondo"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Fondo web
                  </label>
                  <input
                    type="file"
                    id="fondo"
                    ref={fondoInputRef}
                    onChange={handleFondoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* Input para la imagen del logo */}
                <div>
                  <label
                    htmlFor="logo"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Logo web
                  </label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    id="logo"
                    onChange={handleLogoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* Botón para agregar más botones */}
                <button
                  type="button"
                  onClick={() =>
                    openModal({
                      nombre: "",
                      href: "",
                      backgroundColor: "",
                      textColor: "",
                      borderRadius: "",
                      borderWidth: "",
                    })
                  }
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Agregar Botón
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openModalRedSocial({
                      icon: "facebook",
                      href: "",
                      backgroundColor: "",
                      ColorIcon: "",
                    })
                  }
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Agregar Red Social
                </button>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Guardar cambios
                </button>
              </form>
            </>
          )}
        </div>

        {/* Contenedor de vista previa */}
        <div className="col-span-2 mb-12 border rounded-2xl p-6 bg-white flex flex-col gap-6 max-h-[385px] overflow-y-auto">
          {DataMenuWeb.length > 0 ? null : (
            <>
              <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
                Vista Previa Menú Web
              </p>
              <div
                className="dark:text-white top-0 left-0 w-full bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-center items-center"
                style={{
                  backgroundImage: `url(${fondoPreview})`,
                }}
              >
                <div className="flex flex-col gap-4 text-center">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-40 w-auto mx-auto"
                    />
                  )}

                  {/* Renderizar los botones */}
                  <div className="flex flex-col gap-4 text-center ">
                    {botones.map((boton) => (
                      <div key={boton.id} className="relative ">
                        <a
                          href={boton.href}
                          className="py-2 px-4 inline-block font-semibold text-center"
                          style={{
                            backgroundColor: boton.backgroundColor,
                            color: boton.textColor,
                            borderRadius: `${boton.borderRadius}px`,
                            borderWidth: `${boton.borderWidth}px`,
                            borderStyle: "solid",
                          }}
                        >
                          {boton.nombre || "Botón Sin Nombre"}
                        </a>

                        {/* Edit and Delete buttons */}
                        <div className="absolute top-0 right-0">
                          <button
                            onClick={() => openModal(boton)}
                            className="text-blue-500 mx-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminarBoton(boton.id)}
                            className="text-red-500 mx-2"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-4">
                    {redesSociales.map((red) => (
                      <div className="flex flex-col">
                        <div
                          key={red.id}
                          className="relative  p-2 rounded-full flex flex-col items-center"
                        >
                          <a
                            href={red.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full"
                            style={{
                              backgroundColor: red.backgroundColor,
                              color: red.ColorIcon,
                            }}
                          >
                            <div className="text-3xl">
                              {iconosRedes[red.icon] || <FaFacebook />}
                            </div>{" "}
                            {/* Tamaño del ícono ajustado */}
                          </a>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => openModalRedSocial(red)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminarRedSocial(red.id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal para editar/agregar botones */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">
              {currentBoton.id ? "Editar Botón" : "Agregar Botón"}
            </h3>

            <div className="space-y-4">
              {/* Campo de texto para el nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium">
                  Nombre del Botón
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={currentBoton.nombre}
                  onChange={handleBotonChange}
                  className="block w-full mt-1 border rounded-lg p-2"
                />
              </div>

              {/* Campo de texto para la URL */}
              <div>
                <label htmlFor="href" className="block text-sm font-medium">
                  URL del Botón
                </label>
                <input
                  type="text"
                  id="href"
                  name="href"
                  value={currentBoton.href}
                  onChange={handleBotonChange}
                  className="block w-full mt-1 border rounded-lg p-2"
                />
              </div>

              {/* Selector de color de fondo */}
              <div>
                <label
                  htmlFor="backgroundColor"
                  className="block text-sm font-medium"
                >
                  Color de Fondo
                </label>
                <input
                  type="color"
                  id="backgroundColor"
                  name="backgroundColor"
                  value={currentBoton.backgroundColor}
                  onChange={handleBotonChange}
                  className="w-full h-10 p-2.5 rounded-lg"
                />
              </div>

              {/* Selector de color de texto */}
              <div>
                <label
                  htmlFor="textColor"
                  className="block text-sm font-medium"
                >
                  Color del Texto
                </label>
                <input
                  type="color"
                  id="textColor"
                  name="textColor"
                  value={currentBoton.textColor}
                  onChange={handleBotonChange}
                  className="w-full h-10 p-2.5 rounded-lg"
                />
              </div>

              {/* Campo para el borde redondeado */}
              <div>
                <label
                  htmlFor="borderRadius"
                  className="block text-sm font-medium"
                >
                  Borde Redondeado (px)
                </label>
                <input
                  type="number"
                  id="borderRadius"
                  name="borderRadius"
                  value={currentBoton.borderRadius}
                  onChange={handleBotonChange}
                  className="block w-full mt-1 border rounded-lg p-2"
                />
              </div>

              {/* Campo para el ancho del borde */}
              <div>
                <label
                  htmlFor="borderWidth"
                  className="block text-sm font-medium"
                >
                  Ancho del Borde (px)
                </label>
                <input
                  type="number"
                  id="borderWidth"
                  name="borderWidth"
                  value={currentBoton.borderWidth}
                  onChange={handleBotonChange}
                  className="block w-full mt-1 border rounded-lg p-2"
                />
              </div>

              {/* Nuevo campo: Checkbox para domicilio */}
              <div>
                <label
                  htmlFor="domicilio"
                  className="block text-sm font-medium"
                >
                  ¿Es para el menú de domicilios?
                </label>
                <input
                  type="checkbox"
                  id="domicilio"
                  name="domicilio"
                  checked={currentBoton.domicilio || false}
                  onChange={handleBotonChange}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Botones de Cancelar y Guardar */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBoton}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar/agregar redes sociales */}

      {showModalRedSocial && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Agregar o Editar Red Social
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="icon" className="block text-sm font-medium">
                  Ícono de la Red Social
                </label>
                <select
                  id="icon"
                  name="icon"
                  value={currentRedSocial.icon}
                  onChange={handleRedSocialChange}
                  className="block w-full mt-1 border rounded-lg p-2"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label htmlFor="href" className="block text-sm font-medium">
                  Enlace de la Red Social
                </label>
                <input
                  type="url"
                  id="href"
                  name="href"
                  value={currentRedSocial.href}
                  onChange={handleRedSocialChange}
                  className="block w-full mt-1 border rounded-lg p-2"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="backgroundColor"
                className="block text-sm font-medium"
              >
                Color de Fondo
              </label>
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={currentRedSocial.backgroundColor}
                onChange={handleRedSocialChange}
                className="w-full h-10 p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="backgroundColor"
                className="block text-sm font-medium"
              >
                Color del Icono
              </label>
              <input
                type="color"
                id="ColorIcon"
                name="ColorIcon"
                value={currentRedSocial.ColorIcon}
                onChange={handleRedSocialChange}
                className="w-full h-10 p-2.5 rounded-lg"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModalRedSocial}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRedSocial}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default MenúWeb;
