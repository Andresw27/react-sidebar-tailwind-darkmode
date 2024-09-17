import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { IoSearch, IoClose, IoFilter } from "react-icons/io5";
import { Tooltip } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { db } from "../firebase-config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";
import Modal from "../components/Modal";
function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTermHistorialSolicitudes, setSearchTermHistorialSolicitudes] =
    useState("");
  const [
    searchTermHistorialSolicitudesRedenciones,
    setSearchTermHistorialSolicitudesRedenciones,
  ] = useState("");
  const [currentPageHistorialSolicitudes, setCurrentPageHistorialSolicitudes] =
    useState(1);
  const [
    currentPageHistorialSolicitudesRedenciones,
    setCurrentPageHistorialSolicitudesRedenciones,
  ] = useState(1);
  const [rowsPerPage] = useState(10);
  const [rowsPerPageHistorialSolicitudes] = useState(10);
  const [rowsPerPageHistorialSolicitudesRedenciones] = useState(10);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchVisibleHistorial, setSearchVisibleHistorial] = useState(false);
  const [
    searchVisibleHistorialRedenciones,
    setSearchVisibleHistorialRedenciones,
  ] = useState(false);

  const [dataClientes, setDataClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { identificador } = useSelector((state) => state.user);
  const [openDrop, setOpenDrop] = useState(null);
  const [selectClienteModalHistorial, setselectClienteModalHistorial] =
    useState("");
  const [openModalHistorialSolicitudes, setopenModalHistorialSolicitudes] =
    useState("");
  const [dataSolicitudesHistorial, setdataSolicitudesHistorial] = useState([]);
  const [dataRedecionesHistorial, setdataRedecionesHistorial] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    estado: null,
  });

  const [openModalDetallesSolicitud, setopenModalDetallesSolicitud] =
    useState("");
  const [selectSolicitudHistorial, setselectSolicitudHistorial] = useState("");
  const [
    selectSolicitudHistorialRedencion,
    setselectSolicitudHistorialRedencion,
  ] = useState("");

  const [openModalHistorialRedenciones, setopenModalHistorialRedenciones] =
    useState("");
  const [
    selectClienteModalHistorialRedencion,
    setselectCselectClienteModalHistorialRedencion,
  ] = useState("");
  const [
    openModalDetallesSolicitudRedencion,
    setopenModalDetallesSolicitudRedencion,
  ] = useState("");

  const [nombreCliente,setnombreCliente]= useState("");
  const [selecteditarcliente,setselecteditarcliente] =useState(null)
  const [editarcliente,seteditarcliente]= useState("");

  //funcion abrir modal editar cliente

  const handleopeneditcliente = (cliente)=>{
    seteditarcliente(true)
    setselecteditarcliente(cliente)
    setnombreCliente(cliente.nombre)
    console.log(cliente)
  }
  const handleclosededitcliente = ()=>{
    seteditarcliente(false)
  }


  //funcion para abrir modal de historial de redenciones

  const HandleOpenModalhistorialRedenciones = (clienteId) => {
    setopenModalHistorialRedenciones(true);
    setOpenDrop(false);
    setselectCselectClienteModalHistorialRedencion(clienteId);
    console.log(clienteId);
  };

  const HandleClosedModalhistorialRedenciones = () => {
    setopenModalHistorialRedenciones(false);
  };

  //funcion para abrir modal de detalles de historial de Redenciones
  const HandleopenModalDetallesSolicitudRedenciones = (solicitud) => {
    setopenModalDetallesSolicitudRedencion(true);
    setselectSolicitudHistorialRedencion(solicitud);
    console.log(solicitud);
  };
  //funcion para cerrar modal de detalles historial de Redenciones

  const HandleClosedModalDetallesSolictudRedenciones = () => {
    setopenModalDetallesSolicitudRedencion(false);
  };

  //funcion para abrir modal de detalles de historial de solicitudes
  const HandleopenModalDetallesSolicitud = (solicitud) => {
    setopenModalDetallesSolicitud(true);
    setselectSolicitudHistorial(solicitud);
    console.log(solicitud);
  };
  //funcion para cerrar modal de detalles historial de solicitudes

  const HandleClosedModalDetallesSolictud = () => {
    setopenModalDetallesSolicitud(false);
  };
  //funcion para abrir modal de historial de solicitudes

  const HandleOpenModalHistorialSolicitudes = (clienteId, solictud) => {
    setopenModalHistorialSolicitudes(true);
    setOpenDrop(false);
    setselectClienteModalHistorial(clienteId);
    console.log(clienteId);
  };
  //funcion para cerrar modal de historial de solicitudes

  const HandleClosedModalHistorialSolicitudes = () => {
    setopenModalHistorialSolicitudes(false);
    setselectClienteModalHistorial(null);
  };
  //funcion para abrir y cerrar dropdow de opciones de historial de soli y redencion

  const openDropdownHistorial = (clienteId) => {
    setOpenDrop((prevId) => (prevId === clienteId ? null : clienteId));
  };

  useEffect(() => {
    let unsubscribe;

    const fetchSolicitudes = async () => {
      try {
        // console.log("Identificador:", identificador);

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
          // console.error("Usuario no encontrado");
          return;
        } else {
          // console.log("UID del usuario encontrado:", uidUser);
        }

        const clientesQuery = collection(db, "usuarios", uidUser, "clientes");

        unsubscribe = onSnapshot(clientesQuery, (snapshot) => {
          if (!snapshot.empty) {
            const clientes = [];
            snapshot.forEach((doc) => {
              clientes.unshift({
                ...doc.data(),
                id: doc.id,
              });
            });
            setDataClientes(clientes);
            // console.log("Clientes actualizados:", clientes);
          } else {
            // console.log("No hay clientes disponibles.");
            setDataClientes([]);
          }
          setIsLoading(false);
        });
      } catch (error) {
        // console.error("Error al obtener los datos:", error.message);
        setIsLoading(false);
      }
    };

    fetchSolicitudes();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [identificador]);

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };

  const handleSearchClickHistorialSolicitudes = () => {
    setSearchVisibleHistorial(true);
  };

  const handleCloseClickHistorialSolicitudes = () => {
    setSearchTermHistorialSolicitudes("");
    setSearchVisibleHistorial(false);
  };

  const filterDataCliente = dataClientes.filter(
    (cliente) =>
      (cliente.id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentClientes = filterDataCliente.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateHistorialSolicitudes = (pageNumber) =>
    setCurrentPageHistorialSolicitudes(pageNumber);

  const TotalUsuarios = dataClientes.length;

  const fetchContentType = async (url) => {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      // console.log(contentType, "dd");

      return contentType;
    } catch (error) {
      // console.error(`Error fetching content-type for URL: ${url}`, error);
      return "Fetch failed";
    }
  };
  //fetch solicitudes
  useEffect(() => {
    let unsubscribe;

    const fetchHistorialSolicitudes = async () => {
      try {
        // console.log("Identificador:", identificador);

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
          // console.error("Usuario no encontrado");
          return;
        } else {
          // console.log("UID del usuario encontrado:", uidUser);
        }

        const solicitudesQuery = collection(
          db,
          "solicitudes",
          uidUser,
          "historial"
        );

        unsubscribe = onSnapshot(solicitudesQuery, async (snapshot) => {
          if (!snapshot.empty) {
            const solicitudes = [];

            for (const doc of snapshot.docs) {
              const data = doc.data();
              if (data.recibo) {
                // Await para fetchContentType dentro del bucle for...of
                data.contentType = await fetchContentType(data.recibo);
              }
              solicitudes.unshift({
                ...data,
                id: doc.id,
              });
            }

            setdataSolicitudesHistorial(solicitudes);
            // console.log("Historial de solicitudes actualizado:", solicitudes);
          } else {
            // console.log("No hay solicitudes disponibles.");
            setdataSolicitudesHistorial([]);
          }
          setIsLoading(false);
        });
      } catch (error) {
        // console.error(
        //   "Error al obtener el historial de solicitudes:",
        //   error.message
        // );
        setIsLoading(false);
      }
    };

    fetchHistorialSolicitudes();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [identificador]);

  const solicitudesFiltradasHistorial = Array.isArray(dataSolicitudesHistorial)
    ? dataSolicitudesHistorial.filter(
        (solicitud) =>
          solicitud.numerowp === selectClienteModalHistorial &&
          ((solicitud.idSolicitud
            ?.toLowerCase()
            .includes(searchTermHistorialSolicitudes.toLowerCase()) ??
            false) ||
            (solicitud.nombre
              ?.toLowerCase()
              .includes(searchTermHistorialSolicitudes.toLowerCase()) ??
              false)) &&
          (selectedFilters.estado
            ? solicitud.estado === selectedFilters.estado
            : true)
      )
    : [];

  const indexOfLastHistorial =
    currentPageHistorialSolicitudes * rowsPerPageHistorialSolicitudes;
  const indexOfFirstHistorial =
    indexOfLastHistorial - rowsPerPageHistorialSolicitudes;
  const solicitudesFiltradas = solicitudesFiltradasHistorial.slice(
    indexOfFirstHistorial,
    indexOfLastHistorial
  );

  const isFilterActive = (filterKey, value) => {
    return selectedFilters[filterKey] === value;
  };

  const handleClearAndCloseFilters = () => {
    setSelectedFilters({ estado: null });
    setOpenFilter(false);
  };

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: prevFilters[filterKey] === value ? null : value,
    }));
  };

  //fetch solicitudes de redencion
  useEffect(() => {
    let unsubscribe;

    const fetchHistorialRedenciones = async () => {
      try {
        // console.log("Identificador:", identificador);

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
          // console.error("Usuario no encontrado");
          return;
        } else {
          // console.log("UID del usuario encontrado:", uidUser);
        }

        const solicitudesQuery = collection(
          db,
          "usuarios",
          uidUser,
          "redenciones"
        );

        unsubscribe = onSnapshot(solicitudesQuery, async (snapshot) => {
          if (!snapshot.empty) {
            const redenciones = [];

            for (const doc of snapshot.docs) {
              const data = doc.data();

              redenciones.unshift({
                ...data,
                id: doc.id,
              });
            }

            setdataRedecionesHistorial(redenciones);
            // console.log("Historial de redenciones:", redenciones);
          } else {
            // console.log("No hay redenciones disponibles.");
            setdataRedecionesHistorial([]);
          }
          setIsLoading(false);
        });
      } catch (error) {
        // console.error(
        //   "Error al obtener el historial de redenciones:",
        //   error.message
        // );
        setIsLoading(false);
      }
    };

    fetchHistorialRedenciones();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [identificador]);

  const RedencionesFiltradasHistorial = Array.isArray(dataRedecionesHistorial)
    ? dataRedecionesHistorial.filter((redencion) => {
        const matchesNumerowp =
          redencion.numerowp === selectClienteModalHistorialRedencion;
        const matchesSearchTerm =
          (redencion.nombreCliente
            ?.toLowerCase()
            .includes(
              searchTermHistorialSolicitudesRedenciones.toLowerCase()
            ) ??
            false) ||
          (redencion.fecha
            ?.toLowerCase()
            .includes(
              searchTermHistorialSolicitudesRedenciones.toLowerCase()
            ) ??
            false) ||
          (redencion.nombrePremio
            ?.toLowerCase()
            .includes(
              searchTermHistorialSolicitudesRedenciones.toLowerCase()
            ) ??
            false) ||
          (redencion.tipoPremio
            ?.toLowerCase()
            .includes(
              searchTermHistorialSolicitudesRedenciones.toLowerCase()
            ) ??
            false) ||
          (redencion.estado
            ?.toLowerCase()
            .includes(
              searchTermHistorialSolicitudesRedenciones.toLowerCase()
            ) ??
            false);
        const matchesSelectedEstado = selectedFilters.estado
          ? redencion.estado === selectedFilters.estado
          : true;

        return matchesNumerowp && matchesSearchTerm && matchesSelectedEstado;
      })
    : [];

  const indexOfLastHistorialRedencion =
    currentPageHistorialSolicitudesRedenciones *
    rowsPerPageHistorialSolicitudesRedenciones;
  const indexOfFirstHistorialRedenciones =
    indexOfLastHistorialRedencion - rowsPerPageHistorialSolicitudesRedenciones;
  const redencionesFiltradas = RedencionesFiltradasHistorial.slice(
    indexOfFirstHistorialRedenciones,
    indexOfLastHistorialRedencion
  );

  const handleEditCliente = async (e) => {
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
        "usuarios",
        uidUser,
        "clientes",
        selecteditarcliente.id
      );

      const updatedPublicidad = {
        nombre: nombreCliente || selecteditarcliente.nombre,
      };

      // Actualizar la publicidad en Firestore
      await updateDoc(publicidadRef, updatedPublicidad);
      handleclosededitcliente();
     
      console.log("Publicidad editada exitosamente en Firestore.");
    } catch (error) {
      console.error("Error al editar la publicidad:", error);
    }
  };

  return (
    <Layout>
      <div className="my-3 mx-10 flex justify-start gap-4">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Usuarios
        </p>
        <div className="text-4xl rounded-full">
          <p className="text-black font-bold">{TotalUsuarios}</p>
        </div>
      </div>

      <div className="col-span-2 relative overflow-x-auto shadow-md mx-4 sm:rounded-lg">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            {!searchVisible && (
              <div>
                <Tooltip content="Buscar Cliente">
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
                  className="p-2 border border-gray-300 rounded-full"
                  placeholder="Buscar Cliente..."
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
              role="status"
            >
              <span className="visually-hidden"></span>
            </div>
          </div>
        ) : (
          <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Número whatsapp
                </th>
                <th scope="col" className="px-6 py-3">
                  Nombre cliente
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Puntos
                </th>
                <th scope="col" className="px-6 py-3">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {currentClientes.map((cliente, index, clienteId) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                    {cliente.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {cliente.nombre}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                    {cliente.puntos}
                  </td>

                  <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                    <Tooltip content="Historiales">
                      <button
                        id="dropdownMenuIconButton"
                        onClick={() => openDropdownHistorial(cliente.id)}
                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                      </button>
                    </Tooltip>

                    {openDrop === cliente.id && (
                      <div
                        id="dropdownDots"
                        className="z-50 absolute bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownMenuIconButton"
                        >
                          <li>
                            <a
                              onClick={() =>
                                handleopeneditcliente(cliente)
                              }
                              className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Editar Cliente
                            </a>
                          </li>
                          <Modal
                          isOpen={editarcliente}
                          onClose={handleclosededitcliente}
                          nombre="Editar Cliente"
                          size="auto"
                          >  <form
                  className="space-y-6 my-5 px-2"
                  onSubmit={handleEditCliente}
                >
                  <div>
                    <label
                      htmlFor="nombreAccion"
                      className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                    >
                      Nombre Cliente
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setnombreCliente(e.target.value)}
                      value={nombreCliente}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                      
                      
                    />
                  </div>

                

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    Editar Cliente
                  </button>
                </form>
                          </Modal>
                          <li>
                            <a
                              onClick={() =>
                                HandleOpenModalHistorialSolicitudes(cliente.id)
                              }
                              className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Historial Solicitudes
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                HandleOpenModalhistorialRedenciones(cliente.id)
                              }
                              className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Historial Redenciones
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Modal
          isOpen={openModalHistorialSolicitudes}
          onClose={HandleClosedModalHistorialSolicitudes}
          nombre="Historial Solicitudes de Puntos"
        >
          <div className="col-span-2 relative overflow-x-auto shadow-md mx-4 sm:rounded-lg">
            <div className="flex justify-between items-center p-4">
              <div className="flex gap-4">
                {!searchVisibleHistorial && (
                  <div>
                    <Tooltip content="Buscar Cliente" className="z-50">
                      <div
                        className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full"
                        onClick={handleSearchClickHistorialSolicitudes}
                      >
                        <IoSearch />
                      </div>
                    </Tooltip>
                  </div>
                )}
                {searchVisibleHistorial && (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={searchTermHistorialSolicitudes}
                      onChange={(e) =>
                        setSearchTermHistorialSolicitudes(e.target.value)
                      }
                      className="p-2 border  border-gray-300 rounded-full"
                      placeholder="Buscar..."
                    />
                    <div
                      className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full ml-2"
                      onClick={handleCloseClickHistorialSolicitudes}
                    >
                      <IoClose />
                    </div>
                  </div>
                )}

                <div>
                  <Tooltip content="Filtrar por estado" className="z-50">
                    <div
                      onClick={() => setOpenFilter(!openFilter)}
                      className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full"
                    >
                      <IoFilter />
                    </div>
                  </Tooltip>
                </div>
                {openFilter && (
                  <div className="flex justify-start gap-4 ">
                    <button
                      className={`p-2 rounded-full ${
                        isFilterActive("estado", "Aceptado")
                          ? "bg-red-100 text-black font-semibold"
                          : "bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("estado", "Aceptado")}
                    >
                      Aceptado
                    </button>
                    <button
                      className={`p-2 rounded-full ${
                        isFilterActive("estado", "Rechazado")
                          ? "bg-blue-100 text-black font-semibold"
                          : "bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("estado", "Rechazado")}
                    >
                      Rechazado
                    </button>
                    <button
                      onClick={handleClearAndCloseFilters}
                      className="font-bold"
                    >
                      Limpiar y cerrar filtros
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div
                  className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID solicitud
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesFiltradas.map((solicitud, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                        {solicitud.idSolicitud}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {solicitud.fecha}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                        {solicitud.nombre}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                        <span
                          className={
                            solicitud.estado === "Rechazado"
                              ? "bg-red-100 text-red-800 text-xs font-medium p-1 rounded dark:bg-red-900 dark:text-red-300"
                              : "bg-green-100 text-green-800 text-xs font-medium  p-1 rounded dark:bg-green-900 dark:text-green-300"
                          }
                        >
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                        <button
                          onClick={() =>
                            HandleopenModalDetallesSolicitud(solicitud)
                          }
                          className="p-2 text-white bg-blue-700 hover:bg-blue-800 rounded"
                        >
                          Ver Detalles Solicitud
                        </button>
                      </td>
                    </tr>
                  ))}
                  <Modal
                    isOpen={openModalDetallesSolicitud}
                    onClose={HandleClosedModalDetallesSolictud}
                    nombre="Detalles de Solicitud"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start p-6">
                      <div className="flex justify-center flex-col">
                        {selectSolicitudHistorial.contentType &&
                        selectSolicitudHistorial.contentType.includes(
                          "image"
                        ) ? (
                          <img
                            className="h-96 w-86"
                            src={`${selectSolicitudHistorial.recibo}`}
                            alt="Recibo"
                          />
                        ) : selectSolicitudHistorial.contentType &&
                          selectSolicitudHistorial.contentType.includes(
                            "video"
                          ) ? (
                          <video className="h-96 w-full" controls>
                            <source
                              src={`${selectSolicitudHistorial.recibo}`}
                              type={selectSolicitudHistorial.contentType}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <p>Formato de archivo no soportado</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-md">
                        {/* Columna 1 */}
                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-700">
                            Nombre Cliente:
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectSolicitudHistorial.nombre}
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-700">
                            Número WhatsApp:
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectSolicitudHistorial.numerowp}
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-700">
                            Fecha:
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectSolicitudHistorial.fecha}
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-700">
                            ID Solicitud:
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectSolicitudHistorial.idSolicitud}
                          </p>
                        </div>

                        {/* Columna 2 */}
                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-700">
                            Descripción:
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectSolicitudHistorial.descripcion}
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-700">
                            Estado:
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectSolicitudHistorial.estado}
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-lg font-semibold text-gray-700">
                            Puntos Obtenidos:
                          </p>
                          <p className="text-lg text-gray-800">100</p>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </tbody>
              </table>
            )}
          </div>
          {!isLoading && (
            <div className="mt-2 flex justify-end mx-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    paginateHistorialSolicitudes(
                      currentPageHistorialSolicitudes - 1
                    )
                  }
                  disabled={currentPageHistorialSolicitudes === 1}
                  className="p-2 border border-gray-300 rounded"
                >
                  Anterior
                </button>
                <span>{`Page ${currentPageHistorialSolicitudes} of ${Math.ceil(
                  solicitudesFiltradas.length / rowsPerPageHistorialSolicitudes
                )}`}</span>
                <button
                  onClick={() =>
                    paginateHistorialSolicitudes(
                      currentPageHistorialSolicitudes + 1
                    )
                  }
                  disabled={
                    currentPageHistorialSolicitudes ===
                    Math.ceil(
                      solicitudesFiltradas.length /
                        rowsPerPageHistorialSolicitudes
                    )
                  }
                  className="p-2 border border-gray-300 rounded"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={openModalHistorialRedenciones}
          onClose={HandleClosedModalhistorialRedenciones}
          nombre="Historial Solicitudes de Redención de premios"
        >
          <div className="col-span-2 relative overflow-x-auto shadow-md mx-4 sm:rounded-lg">
            <div className="flex justify-between items-center p-4">
              <div className="flex gap-4">
                {!searchVisibleHistorial && (
                  <div>
                    <Tooltip content="Buscar Cliente" className="z-50">
                      <div
                        className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full"
                        onClick={handleSearchClickHistorialSolicitudes}
                      >
                        <IoSearch />
                      </div>
                    </Tooltip>
                  </div>
                )}
                {searchVisibleHistorial && (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={searchTermHistorialSolicitudesRedenciones}
                      onChange={(e) =>
                        setSearchTermHistorialSolicitudesRedenciones(
                          e.target.value
                        )
                      }
                      className="p-2 border  border-gray-300 rounded-full"
                      placeholder="Buscar..."
                    />
                    <div
                      className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full ml-2"
                      onClick={handleCloseClickHistorialSolicitudes}
                    >
                      <IoClose />
                    </div>
                  </div>
                )}

                <div>
                  <Tooltip content="Filtrar por estado" className="z-50">
                    <div
                      onClick={() => setOpenFilter(!openFilter)}
                      className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full"
                    >
                      <IoFilter />
                    </div>
                  </Tooltip>
                </div>
                {openFilter && (
                  <div className="flex justify-start gap-4 ">
                    <button
                      className={`p-2 rounded-full ${
                        isFilterActive("estado", "Entregado")
                          ? "bg-green-100 text-black font-semibold"
                          : "bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("estado", "Entregado")}
                    >
                      Entregado
                    </button>
                    <button
                      className={`p-2 rounded-full ${
                        isFilterActive("estado", "Solicitado")
                          ? "bg-red-100 text-black font-semibold"
                          : "bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("estado", "Solicitado")}
                    >
                      Solicitado
                    </button>
                    <button
                      onClick={handleClearAndCloseFilters}
                      className="font-bold"
                    >
                      Limpiar y cerrar filtros
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div
                  className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID solicitud
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nombre Cliente
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {redencionesFiltradas.map((solicitud, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                        {solicitud.idPremio}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {solicitud.fecha}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                        {solicitud.nombreCliente}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                        <span
                          className={
                            solicitud.estado === "Solicitado"
                              ? "bg-red-100 text-red-800 text-xs font-medium p-1 rounded dark:bg-red-900 dark:text-red-300"
                              : "bg-green-100 text-green-800 text-xs font-medium  p-1 rounded dark:bg-green-900 dark:text-green-300"
                          }
                        >
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                        <button
                          onClick={() =>
                            HandleopenModalDetallesSolicitudRedenciones(
                              solicitud
                            )
                          }
                          className="p-2 text-white bg-blue-700 hover:bg-blue-800 rounded"
                        >
                          Ver Detalles Solicitud
                        </button>
                      </td>
                    </tr>
                  ))}
                  <Modal
                    isOpen={openModalDetallesSolicitudRedencion}
                    onClose={HandleClosedModalDetallesSolictudRedenciones}
                    nombre="Detalles de solicitud de redención de premio"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-10 items-start p-6">
                      {/* <div className="flex justify-center flex-col">
                        {selectSolicitudHistorial.contentType &&
                        selectSolicitudHistorial.contentType.includes(
                          "image"
                        ) ? (
                          <img
                            className="h-96 w-86"
                            src={`${selectSolicitudHistorial.recibo}`}
                            alt="Recibo"
                          />
                        ) : selectSolicitudHistorial.contentType &&
                          selectSolicitudHistorial.contentType.includes(
                            "video"
                          ) ? (
                          <video className="h-96 w-full" controls>
                            <source
                              src={`${selectSolicitudHistorial.recibo}`}
                              type={selectSolicitudHistorial.contentType}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <p>Formato de archivo no soportado</p>
                        )}
                      </div> */}
                      <div class="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-8">
                        <div class="bg-blue-600 p-4">
                          <h2 class="text-2xl font-bold text-white">
                            Detalles de la Redención
                          </h2>
                        </div>
                        <div class="p-6 space-y-4">
                          <div class="flex justify-between">
                            <span class="text-gray-600 font-semibold">
                              Fecha:
                            </span>
                            <span class="text-gray-900">
                              {selectSolicitudHistorialRedencion.fecha}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600 font-semibold">
                              Número WhatsApp:
                            </span>
                            <span class="text-gray-900">
                              {selectSolicitudHistorialRedencion.numerowp}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600 font-semibold">
                              ID Solicitud:
                            </span>
                            <span class="text-gray-900">
                              {selectSolicitudHistorialRedencion.idPremio}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600 font-semibold">
                              Nombre del Premio:
                            </span>
                            <span class="text-gray-900">
                              {selectSolicitudHistorialRedencion.nombrePremio}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600 font-semibold">
                              Estado:
                            </span>
                            <span
                              className={
                                selectSolicitudHistorialRedencion.estado ===
                                "Entregado"
                                  ? "text-green-600 font-bold"
                                  : "text-red-600 font-bold"
                              }
                            >
                              {selectSolicitudHistorialRedencion.estado}
                            </span>
                          </div>

                          <div class="flex justify-between">
                            <span class="text-gray-600 font-semibold">
                              Nombre del Cliente:
                            </span>
                            <span class="text-gray-900">
                              {selectSolicitudHistorialRedencion.nombreCliente}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600 font-semibold">
                              Puntos Redimidos:
                            </span>
                            <span class="text-gray-900">
                              {
                                selectSolicitudHistorialRedencion.puntosRedimidos
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </tbody>
              </table>
            )}
          </div>
          {!isLoading && (
            <div className="mt-2 flex justify-end mx-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    paginateHistorialSolicitudes(
                      currentPageHistorialSolicitudesRedenciones - 1
                    )
                  }
                  disabled={currentPageHistorialSolicitudesRedenciones === 1}
                  className="p-2 border border-gray-300 rounded"
                >
                  Anterior
                </button>
                <span>{`Page ${currentPageHistorialSolicitudesRedenciones} of ${Math.ceil(
                  redencionesFiltradas.length /
                    rowsPerPageHistorialSolicitudesRedenciones
                )}`}</span>
                <button
                  onClick={() =>
                    paginateHistorialSolicitudes(
                      currentPageHistorialSolicitudesRedenciones + 1
                    )
                  }
                  disabled={
                    currentPageHistorialSolicitudesRedenciones ===
                    Math.ceil(
                      redencionesFiltradas.length /
                        rowsPerPageHistorialSolicitudesRedenciones
                    )
                  }
                  className="p-2 border border-gray-300 rounded"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {!isLoading && (
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
              filterDataCliente.length / rowsPerPage
            )}`}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filterDataCliente.length / rowsPerPage)
              }
              className="p-2 border border-gray-300 rounded"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Clientes;
