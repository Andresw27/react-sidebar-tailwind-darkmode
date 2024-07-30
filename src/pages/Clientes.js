import React, { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { IoSearch, IoClose } from "react-icons/io5";
import { Tooltip } from "@material-tailwind/react";
import { UserContext } from "../UserContext"; // Asegúrate de ajustar la ruta correcta

function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [searchVisible, setSearchVisible] = useState(false);
  const [dataClientes, setDataClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const user = useContext(UserContext);

  console.log(user, "f");

  const fetchClientes = async () => {
    try {
      setIsLoading(true); // Inicia la carga
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/obtenerAllPuntos/${user.identificador}`
      );
      const data = await response.json();
      setDataClientes(data.clientes);
      console.log("la data essss", data.clientes);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

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
      (cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) 
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentClientes = filterDataCliente.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="my-3 mx-10">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Clientes
        </p>
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
                  className="p-2 border  border-gray-300 rounded-full"
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
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
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
              </tr>
            </thead>
            <tbody>
              {currentClientes.map((cliente, index) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              disabled={currentPage === Math.ceil(filterDataCliente.length / rowsPerPage)}
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
