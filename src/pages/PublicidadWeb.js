import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { db, storage } from "../firebase-config";
import { Tooltip } from "@material-tailwind/react";
import { IoFastFoodSharp } from "react-icons/io5";

import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  orderBy,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase Storage
import { IoSearch, IoClose } from "react-icons/io5";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import Modal from "../components/Modal";

function PublicidadWeb() {
  const [nombrePublicidad, setnombrePublicidad] = useState(" ");
  const [hrfPublicidad, sethrfPublicidad] = useState(" ");
  const [imagenPublicidad, setimagenPublicidad] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { identificador, nombreEmpresa } = useSelector((state) => state.user);
  const [isActivated, setIsActivated] = useState(false); // Estado para el switch
  const [publicidadId, setPublicidadId] = useState(""); // ID de la publicidad para actualizar
  const [DataPublicidades, setDataPublicidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(4);
  const [searchVisible, setSearchVisible] = useState(false);
  const [publicidadselect, setpublicidadselect] = useState(null);
  const [publicidadesActivadas, setPublicidadesActivadas] = useState({});
  const [editarpublicidad, seteditarpublicidad] = useState("");
  const [selectpublicidadedit, setselectpublicidadedit] = useState("");
  const [deletepublicidad, setdeletepublicidad] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Captura el archivo seleccionado
    setimagenPublicidad(file);

    // Si el archivo existe, crea una URL para previsualizar
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Almacena la URL en el estado
      };
      reader.readAsDataURL(file); // Convierte la imagen a Data URL
    }
  };
  //añadir nueva publicidad
  const handleAddNewPublicidad = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

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
      // Referencia al almacenamiento de Firebase
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `ImgProductosmenu/${nombreEmpresa}/${imagenPublicidad.name}`
      );

      // Subir el archivo a Firebase Storage
      await uploadBytes(storageRef, imagenPublicidad);

      // Obtener la URL de descarga del archivo
      const logoURL = await getDownloadURL(storageRef);

      // Crear el objeto con los datos de la nueva categoría
      const configPublicidad = {
        nombre: nombrePublicidad,
        imagen: logoURL, // Usar la URL obtenida como foto de la categoría
        hrf: hrfPublicidad, // Usa el IdMenu del menú seleccionado
        estado: "false",
      };

      // Guardar la nueva categoría en Firestore (dentro del menú seleccionado)
      await addDoc(
        collection(db, "config", uidUser, "publicidad"),
        configPublicidad
      );

      // Actualizar el estado local de las categorías si es necesario
      //   setDataCategorias([...DataCategorias, newMenuData]);

      //   // Limpiar los campos del formulario
      //   handleclosedmodalnewcategoriamenu();

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = ""; // Limpiar el valor del input de archivo
      }

      fetchPublicidades();
      setnombrePublicidad("");
      sethrfPublicidad("");
      setimagenPublicidad(null); // Reiniciar imagen
      console.log("Categoría añadida exitosamente a Firestore.");
    } catch (error) {
      console.error("Error al añadir la categoría o subir la imagen:", error);
    }
  };

  const handleSwitchChange = (publicidad) => {
    const nuevoEstado = publicidad.estado === "false" ? "true" : "false"; // Cambiar el estado basado en su valor actual
    const updatedPublicidades = DataPublicidades.map((p) =>
      p.id === publicidad.id ? { ...p, estado: nuevoEstado } : p
    );
    setDataPublicidades(updatedPublicidades); // Actualizar el estado local con el nuevo estado
    handleUpdateEstadoPublicidad(publicidad, nuevoEstado); // Actualizar en Firestore
  };

  // Función para actualizar el estado en Firestore
  const handleUpdateEstadoPublicidad = async (publicidad, nuevoEstado) => {
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

      const publicidadDocRef = doc(
        db,
        "config",
        uidUser,
        "publicidad",
        publicidad.id
      );

      // Actualizar el campo "estado" en Firestore
      await updateDoc(publicidadDocRef, {
        estado: nuevoEstado,
      });

      console.log("Estado de la publicidad actualizado exitosamente.");
      fetchPublicidades();
    } catch (error) {
      console.error("Error al actualizar el estado de la publicidad:", error);
    }
  };

  const fetchPublicidades = async () => {
    try {
      // Paso 1: Consultar la colección "usuarios" para obtener el UID del usuario
      const userQuery = query(
        collection(db, "usuarios"),
        where("identificador", "==", identificador) // Asegúrate de tener disponible el identificador
      );

      const querySnapshot = await getDocs(userQuery);
      let uidUser = "";
      querySnapshot.forEach((doc) => {
        uidUser = doc.id; // Obtenemos el ID del documento del usuario
      });

      if (!uidUser) {
        console.error("Usuario no encontrado");
        return;
      }

      // Paso 2: Obtener la colección de "publicidad" del usuario
      const publicidadesCollectionRef = collection(
        db,
        "config",
        uidUser,
        "publicidad"
      );
      const publicidadesSnapshot = await getDocs(publicidadesCollectionRef);

      // Paso 3: Crear un array para almacenar todas las publicidades
      const todasLasPublicidades = [];
      publicidadesSnapshot.forEach((doc) => {
        // Añadir cada publicidad al array, incluyendo su ID
        todasLasPublicidades.unshift({ id: doc.id, ...doc.data() });
      });

      // Paso 4: Actualizar el estado con todas las publicidades obtenidas
      setDataPublicidades(todasLasPublicidades);
      console.log("Publicidades obtenidas:", todasLasPublicidades);
    } catch (error) {
      console.error("Error al obtener las publicidades:", error.message);
    }
  };
  useEffect(() => {
    fetchPublicidades();
  }, []);

  const filteredPublicidades = DataPublicidades.filter(
    (publicidad) =>
      publicidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publicidad.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredPublicidades.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };
  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  //modal editar publicidad
  const handleOpenModaleditPublicidad = (publicidad) => {
    seteditarpublicidad(true);
    setselectpublicidadedit(publicidad);
    setnombrePublicidad(publicidad.nombre);
    setimagenPublicidad(publicidad.imagen);
    sethrfPublicidad(publicidad.hrf);
    setPreviewUrl(publicidad.imagen);
    console.log(publicidad, "dd", publicidad.imagen);
  };
  const handleClosedModaleditPublicidad = () => {
    seteditarpublicidad(false);
    setnombrePublicidad("");
    sethrfPublicidad("");
    setimagenPublicidad(null);
  };

  //funcion para editar publicidad
  const handleEditPublicidad = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    try {
      // Obtener el UID del usuario basado en el identificador
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

      // Referencia al documento de la publicidad a editar
      const publicidadRef = doc(
        db,
        "config",
        uidUser,
        "publicidad",
        selectpublicidadedit.id
      );

      // Verificar si la imagen ha cambiado
      let logoURL = selectpublicidadedit.imagen; // Mantener la URL de la imagen existente por defecto
      if (imagenPublicidad) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `ImgProductosmenu/${nombreEmpresa}/${imagenPublicidad.name}`
        );

        // Subir la nueva imagen a Firebase Storage
        await uploadBytes(storageRef, imagenPublicidad);

        // Obtener la URL de descarga de la nueva imagen
        logoURL = await getDownloadURL(storageRef);
      }

      // Crear el objeto con los nuevos datos de la publicidad
      const updatedPublicidad = {
        nombre: nombrePublicidad || selectpublicidadedit.nombre,
        imagen: logoURL, // Usar la nueva URL o mantener la existente
        hrf: hrfPublicidad || selectpublicidadedit.hrf, // Usa el nuevo hrf o el que ya existe
        estado: selectpublicidadedit.estado || "false", // Mantener el estado existente
      };

      // Actualizar la publicidad en Firestore
      await updateDoc(publicidadRef, updatedPublicidad);

      // Limpiar el formulario y cerrar el modal
      handleClosedModaleditPublicidad();
      setnombrePublicidad("");
      sethrfPublicidad("");
      setimagenPublicidad(null); // Reiniciar imagen
      setPreviewUrl(null);
      fetchPublicidades();
      console.log("Publicidad editada exitosamente en Firestore.");
      fetchPublicidades();
    } catch (error) {
      console.error("Error al editar la publicidad:", error);
    }
  };

  //modal Para eliminar publicidad

  const HandleopenModaldeletePublicidad = (publicidad) => {
    setdeletepublicidad(true);
    setselectpublicidadedit(publicidad);
    console.log(publicidad)
  };
  const HandleclosedModaldeletePublicidad = (publicidad) => {
    setdeletepublicidad(false);
  };

  const handleDeletePublicidad = async (selectpublicidadedit) => {
    try {
      // Obtener el UID del usuario basado en el identificador
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

      // Referencia al documento de la publicidad a editar
      const publicidadRef = doc(
        db,
        "config",
        uidUser,
        "publicidad",
        selectpublicidadedit.id
      );


      console.log(selectpublicidadedit.id)
      // Eliminar la publicación en Firestore
      await deleteDoc(publicidadRef);
      console.log("Publicación eliminada de Firestore");

      // Eliminar la imagen asociada en Firebase Storage, si existe
      if (selectpublicidadedit.imagen) {
        const storage = getStorage();
        const imageRef = ref(storage, selectpublicidadedit.imagen); // Ruta correcta
        await deleteObject(imageRef);
        console.log("Imagen eliminada de Firebase Storage");
      }

      // Limpiar el formulario y cerrar el modal
      HandleclosedModaldeletePublicidad();

      fetchPublicidades();
    } catch (error) {
      console.error("Error al editar la publicidad:", error);
    }
  };
  return (
    <Layout>
      <div className="my-4 mx-10 flex justify-between">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Configurar Publicidad Web
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-6">
        {/* Primer contenedor con los menús */}
        <div className="border shadow-xs dark:bg-slate-600 flex flex-col w-full justify-center md:w-auto mb-12 h-auto px-6 py-2 rounded-2xl md:col-span-1">
          <form className="space-y-4" onSubmit={handleAddNewPublicidad}>
            <div>
              <label
                htmlFor="nombrePublicidad"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nombre Publicidad
              </label>
              <input
                type="text"
                value={nombrePublicidad}
                onChange={(e) => setnombrePublicidad(e.target.value)}
                id="nombrePublicidad"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="imagenPublicidad"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Imagen Publicidad
              </label>
              <input
                type="file"
                id="imagenPublicidad"
                onChange={handleImageChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="redireccionPublicidad"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Redirección Publicidad
              </label>
              <input
                type="text"
                id="redireccionPublicidad"
                value={hrfPublicidad}
                onChange={(e) => sethrfPublicidad(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Guardar Publicidad
            </button>
          </form>
        </div>

        {/* Segundo contenedor con las categorías */}
        <div className="col-span-2 mb-12 border rounded-2xl p-6 bg-white flex  flex-col gap-6 max-h-[385px] overflow-y-auto">
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-4">
              {!searchVisible && (
                <div>
                  <Tooltip content="Buscar Producto">
                    <div
                      className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full"
                      onClick={handleSearchClick}
                    >
                      <IoSearch />
                    </div>
                  </Tooltip>
                </div>
              )}
              {searchVisible && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border  border-gray-300 rounded-full"
                    placeholder="Buscar orden..."
                  />
                  <div
                    className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full ml-2"
                    onClick={handleCloseClick}
                  >
                    <IoClose />
                  </div>
                </div>
              )}
            </div>
          </div>
          <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nombre Publcidad
                </th>
                <th scope="col" className="px-6 py-3">
                  Imagen
                </th>

                <th scope="col" className="px-6 py-3">
                  Hrf
                </th>

                <th scope="col" className="px-6 py-3">
                  Estado
                </th>

                <th scope="col" className="px-6 py-3">
                  Desactivar / Activar
                </th>
                <th scope="col" className="px-6 py-3">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center text-base mt-14 mb-14"
                  >
                    No hay publicidades disponibles por favor agregue un
                    publicidades
                  </td>
                </tr>
              ) : (
                currentProducts.map((publicidad, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4  font-semibold text-gray-900 dark:text-white">
                      {publicidad.nombre}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <img
                        className="h-12 w-12 rounded-md"
                        src={publicidad.imagen}
                      ></img>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {publicidad.hrf}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {publicidad.estado === "false" ? (
                        <p className="bg-red-100 text-red-800 font-medium py-1 px-4 rounded-full dark:bg-red-900 dark:text-red-300">
                          Inactivo
                        </p>
                      ) : (
                        <p className="bg-green-100 text-green-800 font-medium py-1 px-4 rounded-full dark:bg-green-900 dark:text-green-300">
                          Activo
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <label className="inline-flex items-center mb-5 cursor-pointer gap-4">
                        {publicidadesActivadas[publicidad.id] ? (
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Desactivar Publicidad
                          </span>
                        ) : (
                          ""
                        )}

                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={publicidad.estado === "true"} // Establecer el valor de checked dependiendo del estado de la BD
                          onChange={() => handleSwitchChange(publicidad)} // Cambia el estado cuando se cambia el switch
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>

                        {!publicidadesActivadas[publicidad.id] ? (
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Activar Publicidad
                          </span>
                        ) : (
                          ""
                        )}
                      </label>
                    </td>
                    <td className="px-3 py-4 flex gap-2">
                      <Tooltip content="Editar">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenModaleditPublicidad(publicidad)
                          }
                          className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                        >
                          <FaRegEdit />
                        </button>
                      </Tooltip>
                      <Modal
                        nombre="Editar Publicidad"
                        isOpen={editarpublicidad}
                        onClose={handleClosedModaleditPublicidad}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-6 mt-10">
                          <div className="border shadow-xs dark:bg-slate-600 flex flex-col w-full justify-center md:w-auto mb-12 h-auto px-6 py-2 rounded-2xl md:col-span-1">
                            <form
                              className="space-y-4"
                              onSubmit={handleEditPublicidad}
                            >
                              <div>
                                <label
                                  htmlFor="nombrePublicidad"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Nombre Publicidad
                                </label>
                                <input
                                  type="text"
                                  value={nombrePublicidad}
                                  onChange={(e) =>
                                    setnombrePublicidad(e.target.value)
                                  }
                                  id="nombrePublicidad"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="imagenPublicidad"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Imagen Publicidad
                                </label>
                                <input
                                  type="file"
                                  id="imagenPublicidad"
                                  onChange={handleImageChange}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="redireccionPublicidad"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Redirección Publicidad
                                </label>
                                <input
                                  type="text"
                                  id="redireccionPublicidad"
                                  value={hrfPublicidad}
                                  onChange={(e) =>
                                    sethrfPublicidad(e.target.value)
                                  }
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                Actualizar Publicidad
                              </button>
                            </form>
                          </div>
                          <div className="col-span-2 mb-12 border rounded-2xl p-6 bg-white flex  flex-col gap-6 max-h-[385px] overflow-y-auto">
                            {previewUrl && (
                              <div className="">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                  Vista previa de la imagen seleccionada:
                                </label>
                                <img
                                  src={previewUrl} // Muestra la imagen seleccionada
                                  alt="Vista previa"
                                  className="rounded-lg  object-contain" // Ajusta el tamaño y estilo de la imagen
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Modal>
                      <Tooltip content="Eliminar">
                        <button
                          type="button"
                          onClick={() =>
                            HandleopenModaldeletePublicidad(publicidad)
                          }
                          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </Tooltip>
                      <Modal
                        isOpen={deletepublicidad}
                        nombre="Eliminar Publicidad"
                        onClose={HandleclosedModaldeletePublicidad}
                        size="auto"
                        Fondo="auto"
                      >
                        {selectpublicidadedit && (
                          <div className="mt-4">
                            <p>
                              ¿Estás seguro de que deseas eliminar la publicidad{" "}
                              <span className="font-semibold">
                                {selectpublicidadedit.nombre}
                              </span>{" "}
                              <span className="font-semibold"></span>?
                            </p>
                            <img
                              src={selectpublicidadedit.imagen}
                              className="rounded-lg max-h-96 w-full mt-8  object-contain"
                            ></img>

                            <div className="flex justify-end gap-2 mt-4">
                              <button
                                onClick={() =>
                                  handleDeletePublicidad(selectpublicidadedit)
                                }
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={HandleclosedModaldeletePublicidad}
                                className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </Modal>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="mt-2 flex justify-end mx-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded"
              >
                Anterior
              </button>
              <span>{`Page ${currentPage} of ${Math.ceil(
                filteredPublicidades.length / rowsPerPage
              )}`}</span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredPublicidades.length / rowsPerPage)
                }
                className="p-2 border border-gray-300 rounded"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PublicidadWeb;
