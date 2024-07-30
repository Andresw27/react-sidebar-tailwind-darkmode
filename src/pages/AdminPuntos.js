import React, { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { IoSearch, IoClose, IoSettingsSharp } from "react-icons/io5";
import { Tooltip } from "@material-tailwind/react";
import { FaCoins } from "react-icons/fa";

import Modal from "../components/Modal";
import { UserContext } from "../UserContext";
import Alert from "../components/Alert";
function AdminPuntos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [searchVisible, setSearchVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [PuntosModalOpen, setPuntosModalOpen] = useState(false);
  const [selectCliente, setSelectCliente] = useState(null);
  const [valorPuntos, setValorPuntos] = useState("");
  const [compraValor, setCompraValor] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de la alerta
  const user = useContext(UserContext);

  const [dataClientesFactura, setDataClientesFactura] = useState([]);


  const fetchSolicitudes = async () => {
    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/puntos/solicitud/${user.identificador}`
      );
      const data = await response.json();
      setDataClientesFactura(data);
      console.log("data recibos", data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleSubmitPuntos = async (e) => {
    e.preventDefault();

    const ConfigValores = {
      valorMinimo: compraValor,
      PuntosporValor: valorPuntos,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/config/set/valores/${user.identificador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ConfigValores),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to configure points");
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        setAlertMessage("Puntos configurados correctamente");
        setShowAlert(true);
        setCompraValor("");
        setValorPuntos("");
        closePuntosModal();
      } else {
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      console.error("Error configuring points:", error);
      setAlertMessage("Error configurando los puntos. Inténtalo nuevamente.");
      setShowAlert(true);
    }
  };

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };
  //modal Validar puntos
  const openEditModal = (cliente) => {
    setSelectCliente(cliente);

    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  //Modal configurar puntos
  const openPuntosModal = (punto) => {
    setPuntosModalOpen(true);
  };

  const closePuntosModal = () => {
    setPuntosModalOpen(false);
  };

  const handleDecline = (cliente) => {
    setDataClientesFactura((prevData) =>
      prevData.filter((item) => item.idCliente !== cliente.idCliente)
    );
    closeEditModal();
    console.log("ddd", cliente);
  };

  const HandleAprovedCliente = async (cliente) => {

    const clienteAprobado = {
      estado: "Aprobado",
      nombre: cliente.nombre,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/solicitud/actualizar/${user.identificador}/vOFJzsIypaHZWUYe7SYS/3235698785`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteAprobado),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve clientdd points");
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        setAlertMessage("Cliente aprobadoddd correctamente");
        setShowAlert(true);
       
        closeEditModal();
      } else {
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      console.error("Error approving client points:", error);
      setAlertMessage(
        "Error aprobando los puntos del cliente. Inténtalo nuevamente."
      );
      setShowAlert(true);
    }
  };
  const filterDataCliente = dataClientesFactura.filter(
    (cliente) =>
      (cliente.id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (cliente.numerowp?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const CurrentClientes = filterDataCliente.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      <div className="my-3 mx-10">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Administrar Puntos
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
                  placeholder="Buscar Solicitud..."
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
          <div>
            <div className="bg-slate-50 px-10 py-2 cursor-pointer gap-2  text-2xl flex justify-center flex-col items-center rounded-xl">
              <div className="flex justify-center items-center gap-4">
                <p className="text-lg text-black font-medium ">Valor Minimo</p>

                <FaCoins className="text-yellow-400" />
              </div>
              <p className="text-yellow-400 font-semibold">
                {" "}
                {`${Number(user.valorMinimo).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}`}
              </p>
            </div>

            <Modal
              nombre="Configurar Puntos"
              isOpen={PuntosModalOpen}
              onClose={closePuntosModal}
            >
              <form className="space-y-4" onSubmit={handleSubmitPuntos}>
                <div>
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Valor minimo por compra
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setCompraValor(e.target.value)}
                    value={compraValor}
                    id="compraValor"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="number"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Cantidad de Puntos
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setValorPuntos(e.target.value)}
                    value={valorPuntos}
                    id="valorPuntos"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Configurar Puntos
                </button>
              </form>
            </Modal>
          </div>
          <div>
            <div
              className="bg-slate-50 cursor-pointer gap-2 p-2 text-2xl flex justify-center items-center rounded-full"
              onClick={openPuntosModal}
            >
              <p className="text-base text-zinc-600 font-medium ">
                Configurar Puntos
              </p>
              <IoSettingsSharp className="text-yellow-400" />
            </div>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Número whatsapp
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre cliente
              </th>
              <th scope="col" hidden className="px-6 py-3">
                Url Factura
              </th>
              <th scope="col" className="px-6 py-3">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {CurrentClientes.map((cliente, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.numerowp}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.nombre}
                </td>
                <td
                  hidden
                  className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white"
                >
                  {cliente.recibo}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                  <button
                    className="bg-blue-800 text-white p-2 rounded"
                    onClick={() => openEditModal(cliente)}
                  >
                    Validar puntos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          className="h-auto"
          isOpen={editModalOpen}
          nombre="Validar Puntos Cliente"
          onClose={closeEditModal}
        >
          {selectCliente && (
            <div className="grid grid-cols-2 gap-10">
              <div className="flex justify-center flex-col">
                <img className="h-96 w-86" src={`${selectCliente.recibo}`} />
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-semibold text-title">
                  ID Cliente: {selectCliente.id}
                </p>
                <p className="text-lg font-medium">
                  Nombre Cliente: {selectCliente.nombre}
                </p>

                <p className="text-lg font-medium">
                  Número WhatsApp: {selectCliente.numerowp}
                </p>
                <div className="flex gap-4">
                  <p className="text-lg font-medium">Estado</p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => HandleAprovedCliente(selectCliente)}
                      className="bg-green-600 text-white p-2 rounded"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleDecline(selectCliente)}
                      className="bg-red-800 text-white p-2 rounded"
                    >
                      Declinar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
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
            filterDataCliente.length / rowsPerPage
          )}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filterDataCliente.length / rowsPerPage)
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

export default AdminPuntos;
