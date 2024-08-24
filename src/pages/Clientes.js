import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { IoSearch, IoClose } from "react-icons/io5";
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
} from "firebase/firestore";
import Modal from "../components/Modal";
function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchVisible, setSearchVisible] = useState(false);
  const [dataClientes, setDataClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const { identificador } = useSelector((state) => state.user);
  const [openDrop, setOpenDrop] = useState(null);
  const [selectClienteModalHistorial, setselectClienteModalHistorial] =
    useState("");
  const [openModalHistorialSolicitudes, setopenModalHistorialSolicitudes] =
    useState("");
  const [dataSolicitudesHistorial, setdataSolicitudesHistorial] = useState("");

  const HandleOpenModalHistorialSolicitudes = (clienteId, solictud) => {
    setopenModalHistorialSolicitudes(true);
    setOpenDrop(false);
    setselectClienteModalHistorial(clienteId);
    console.log(clienteId);
  };

  const HandleClosedModalHistorialSolicitudes = () => {
    setopenModalHistorialSolicitudes(false);
    setselectClienteModalHistorial(null);
  };

  const openDropdownHistorial = (clienteId) => {
    setOpenDrop((prevId) => (prevId === clienteId ? null : clienteId));
  };

  useEffect(() => {
    let unsubscribe;

    const fetchSolicitudes = async () => {
      try {
        console.log("Identificador:", identificador);

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
        } else {
          console.log("UID del usuario encontrado:", uidUser);
        }

        const clientesQuery = collection(db, "usuarios", uidUser, "clientes");

        unsubscribe = onSnapshot(clientesQuery, (snapshot) => {
          if (!snapshot.empty) {
            const clientes = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setDataClientes(clientes);
            console.log("Clientes actualizados:", clientes);
          } else {
            console.log("No hay clientes disponibles.");
            setDataClientes([]);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
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

  const TotalUsuarios = dataClientes.length;

  useEffect(() => {
    let unsubscribe;

    const fetchHistorialSolicitudes = async () => {
      try {
        console.log("Identificador:", identificador);

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
        } else {
          console.log("UID del usuario encontrado:", uidUser);
        }

        const solicitudesQuery = collection(
          db,
          "solicitudes",
          uidUser,
          "historial"
        );

        unsubscribe = onSnapshot(solicitudesQuery, (snapshot) => {
          if (!snapshot.empty) {
            const solicitudes = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setdataSolicitudesHistorial(solicitudes);
            console.log("Historial de solicitudes actualizado:", solicitudes);
          } else {
            console.log("No hay solicitudes disponibles.");
            setdataSolicitudesHistorial([]);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error(
          "Error al obtener el historial de solicitudes:",
          error.message
        );
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

  const solicitudesFiltradas = Array.isArray(dataSolicitudesHistorial)
    ? dataSolicitudesHistorial.filter(
        (solicitud) => solicitud.numerowp === selectClienteModalHistorial
      )
    : [];

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
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                    {openDrop === cliente.id && (
                      <div
                        id="dropdownDots"
                        className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownMenuIconButton"
                        >
                          <li>
                            <a
                              onClick={() =>
                                HandleOpenModalHistorialSolicitudes(cliente.id)
                              }
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Historial Solicitudes
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
          nombre="Historial Solicitudes"
        >
          {" "}
          <div>
            {solicitudesFiltradas.length > 0 ? (
              solicitudesFiltradas.map((solicitud) => (
                <div key={solicitud.id} className="mb-4">
                  <p>
                    <strong>Detalles:</strong> {solicitud.nombre}
                  </p>
                  <p>
                    <strong>Solicitud ID:</strong> {solicitud.numerowp}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {solicitud.descripcion}
                  </p>
                  <p>
                    <strong>Detalles:</strong> {solicitud.fecha}
                  </p>
                  <p>
                    <strong>Solicitud ID:</strong> {solicitud.id}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {solicitud.idFactura}
                  </p>
                
                  <p>
                    <strong>Detalles:</strong> {solicitud.recibo}
                  </p>
                

                  {/* Mapea otros campos que tengas en la solicitud */}
                </div>
              ))
            ) : (
              <p>No se encontraron solicitudes para este cliente.</p>
            )}
          </div>
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
