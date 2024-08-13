import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Tooltip } from "@material-tailwind/react";
import Alert from "../components/Alert";
import { IoSearch, IoClose, IoFilter } from "react-icons/io5";
import { db } from "../firebase-config";
import { useSelector } from "react-redux";
import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

function RedimirPuntos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [solicitudesData, setSolicitudesData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const { identificador } = useSelector((state) => state.user);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    estado: null,
  });

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: prevFilters[filterKey] === value ? null : value,
    }));
  };

  const isFilterActive = (filterKey, value) => {
    return selectedFilters[filterKey] === value;
  };

  const handleClearAndCloseFilters = () => {
    setSelectedFilters({ estado: null });
    setOpenFilter(false);
  };

  const filteredPuntosRedimir = solicitudesData.filter((punto) => {
    const searchLower = searchTerm.toLowerCase();
    const estadoFilter = selectedFilters.estado
      ? punto.estado === selectedFilters.estado
      : true;

    return (
      estadoFilter &&
      (punto.estado?.toLowerCase().includes(searchLower) ||
        (punto.fecha
          ? new Date(punto.fecha.seconds * 1000)
              .toLocaleDateString()
              .toLowerCase()
              .includes(searchLower)
          : false) ||
        punto.idRedencion?.toLowerCase().includes(searchLower) ||
        punto.nombrePremio?.toLowerCase().includes(searchLower) ||
        punto.puntosRedimidos?.toString().toLowerCase().includes(searchLower) ||
        punto.tipoPremio?.toLowerCase().includes(searchLower))
    );
  });

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredPuntosRedimir.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSolicitudes = async () => {
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

      const userDocRef = collection(db, "usuarios", uidUser, "redenciones");

      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const solicitudes = [];
        snapshot.forEach((doc) => {
          solicitudes.push({ id: doc.id, ...doc.data() });
        });

        setSolicitudesData(solicitudes);
        console.log("data recibos", solicitudes);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  useEffect(() => {
    getSolicitudes();
  }, []);
  const handleEntregarPremio = async (id) => {
    console.log(id, "ides");
    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/puntos/update/estado/${identificador}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: "Aceptado" }),
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo actualizar el estado del premio.");
      }

      setAlertMessage("Premio entregado con éxito.");
      setShowAlert(true);

      // Actualiza el estado localmente
      setSolicitudesData((prevData) =>
        prevData.map((punto) =>
          punto.id === id ? { ...punto, estado: "Entregado" } : punto
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del premio:", error);
      setAlertMessage("Error al entregar el premio.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    getSolicitudes();
  }, []);
  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      <div className="my-3 mx-10">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Redimir Premios
        </p>
      </div>

      <div className="col-span-2 relative overflow-x-auto shadow-md mx-4 sm:rounded-lg">
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
                  placeholder="Buscar..."
                />
                <div
                  className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full ml-2"
                  onClick={handleCloseClick}
                >
                  <IoClose />
                </div>
              </div>
            )}

            <div>
              <Tooltip content="Filtrar por estado">
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
                    isFilterActive("estado", "Solicitado")
                      ? "bg-red-100 text-black font-semibold"
                      : "bg-gray-50"
                  }`}
                  onClick={() => handleFilterChange("estado", "Solicitado")}
                >
                  Solicitado
                </button>
                <button
                  className={`p-2 rounded-full ${
                    isFilterActive("estado", "Entregado")
                      ? "bg-blue-100 text-black font-semibold"
                      : "bg-gray-50"
                  }`}
                  onClick={() => handleFilterChange("estado", "Entregado")}
                >
                  Entregado
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
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id Cliente
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha
              </th>

              <th scope="col" className="px-6 py-3">
                Número Whatsapp
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre Premio
              </th>
              <th scope="col" className="px-6 py-3">
                Tipo Premio
              </th>
              <th scope="col" className="px-6 py-3">
                Total Puntos A redimir
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
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-title mt-10 mb-10">
                  No hay productos disponibles por favor agregue un producto
                </td>
              </tr>
            ) : (
              currentProducts.map((punto, index) => (
                <tr
                  key={punto.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.idRedencion}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.fecha
                      ? new Date(
                          punto.fecha.seconds * 1000
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                 {punto.numerowp}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.nombrePremio}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.tipoPremio}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.puntosRedimidos}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <span
                      className={
                        punto.estado === "Solicitado"
                          ? "bg-red-100 text-red-800 text-base font-medium p-1 rounded dark:bg-red-900 dark:text-red-300"
                          : "bg-green-100 text-green-800 text-base font-medium  p-1 rounded dark:bg-green-900 dark:text-green-300"
                      }
                    >
                      {" "}
                      {punto.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Tooltip
                      content={
                        punto.estado === "Solicitado"
                          ? "Entregar"
                          : "Ya Entregado"
                      }
                    >
                      <button
                        type="button"
                        onClick={() => handleEntregarPremio(punto.idRedencion)}
                        className={`text-white font-medium rounded-lg text-sm p-2 text-center inline-flex items-center 
      ${
        punto.estado === "Solicitado"
          ? "bg-green-700 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-900"
          : "bg-gray-400 cursor-not-allowed"
      }`}
                        disabled={punto.estado !== "Solicitado"}
                      >
                        {punto.estado === "Solicitado"
                          ? "Entregar"
                          : "Entregado"}
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
      </div>
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
            filteredPuntosRedimir.length / rowsPerPage
          )}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredPuntosRedimir.length / rowsPerPage)
            }
            className="p-2 border border-gray-300 rounded"
          >
            Siguiente
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default RedimirPuntos;
