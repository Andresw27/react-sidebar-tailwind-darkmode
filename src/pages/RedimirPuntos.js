import React, { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from "@material-tailwind/react";
import Alert from "../components/Alert"; // Importa el componente de alerta
import { IoSearch, IoClose } from "react-icons/io5";

import { UserContext } from "../UserContext"; // Asegúrate de ajustar la ruta correcta
import { useSelector } from "react-redux";

function RedimirPuntos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [dataProductos, setDataProductos] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [valorProducto, setValorProducto] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de la alerta
  const [isModalOpenn, setIsModalOpenn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const [solicitudesData, setSolicitudesData] = useState([])
  const { identificador } = useSelector((state) => state.user);


  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };

  const dataPuntosredimir = [{ idCliente: "45621", fecha: "9/08/2024", nombreCliente: "jeferson", numerowp: "3234381041", puntos: "1000", premio: "20% en koi koi", estado: "Solicitado" }]

  const filteredPuntosRedimir = dataPuntosredimir.filter(
    (punto) =>
      punto.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      punto.numerowp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      punto.puntos.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredPuntosRedimir.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const getSolicitudes = async () => {
    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/solicitud/premio/${identificador}`,
      );

      const data = await response.json();
      console.log("solicitudes premios",data);
      setSolicitudesData(data);

    } catch (error) {

      console.error("Error updating product:", error);
    }


  }

useEffect(()=>{
  getSolicitudes()
},[])
  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      <div className="my-3 mx-10">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Redimir Puntos
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
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Número Whatsapp
              </th>
              <th scope="col" className="px-6 py-3">
                Premio
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
            {solicitudesData.length === 0 ? (
              <p className="text-center text-title mt-10 mb-10">
                No hay productos disponibles por favor agregue un producto
              </p>
            ) : (
              solicitudesData.map((punto, index) => (
                <tr
                  key={punto.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.idPremio}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.fecha}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.nombre}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.numerowp}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.premio}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {punto.puntosAredimir}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <span className={punto.estado === "Solicitado" ? "bg-red-100 text-red-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300" : "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"}> {punto.estado}</span>

                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Tooltip content="Canjear">
                      <button
                        type="button"
                        className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                      >
                        Canjear Puntos
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
  )
}

export default RedimirPuntos