import React, { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { IoSearch, IoClose, IoSettingsSharp } from "react-icons/io5";
import { Tooltip } from "@material-tailwind/react";
import { FaCoins ,FaBookOpen } from "react-icons/fa";
import { auth } from "../firebase-config";

import { BsGiftFill } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { BsCoin } from "react-icons/bs";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import fetchUserData from "../components/data";
import Modal from "../components/Modal";
import { UserContext } from "../UserContext";
import Alert from "../components/Alert";
import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useSelector } from "react-redux";

function AdminPuntos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermPremio, setSearchTermPremio] = useState("");
  const [searchVisiblePremio, setSearchVisiblePremio] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePremio, setCurrentPagePremio] = useState(1);
  const [rowsPerPagePremio] = useState(4);

  const [rowsPerPage] = useState(5);
  const [searchVisible, setSearchVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [PuntosModalOpen, setPuntosModalOpen] = useState(false);
  const [selectCliente, setSelectCliente] = useState(null);
  const [valorPuntos, setValorPuntos] = useState("");
  const [compraValor, setCompraValor] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [Openmodalpremios, setOpenModalPremios] = useState("");
  const [openViewPremios, setOpenviewPremios] = useState("");
  const user = useContext(UserContext);
  const [valorMinimo, setValorMinimo] = useState(0);
  const [PuntosporValor, setPuntosporValor] = useState(0);
  const [CantidadPuntos, setCantidadPuntos] = useState("");
  const [NombrePremio, setNombrePremio] = useState("");
  const [DescripcionPremio, setDescripcionPremio] = useState("");
  const [DataPremios, setDataPremios] = useState("");
  const { identificador } = useSelector((state) => state.user);
  const [dataClientesFactura, setDataClientesFactura] = useState([]);

  const [PremioEdit, setPremioEdit] = useState("");
  const [selectPremioEdit, setselectPremioEdit] = useState(null);
  const [userPaquete, setUserPaquete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAuth = auth.currentUser;
        if (userAuth) {
          const userData = await fetchUserData(userAuth.uid);

          setUserPaquete(userData.paquete);
          console.log(userPaquete, "ddssss");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  //modal para los configurar premios
  const openModalPremios = () => {
    setOpenModalPremios(true);
  };

  const ClosedModalPremios = () => {
    setOpenModalPremios(false);
  };
  //modal ver premios
  const openModalViewPremios = () => {
    setOpenviewPremios(true);
    setOpenModalPremios(false);
  };

  const ClosedModalViewPremios = () => {
    setOpenviewPremios(false);
  };

  const fetchSolicitudes = async () => {
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
        // console.error("Usuario no encontrado");
        return;
      }

      const solicitudesRef = collection(
        db,
        "solicitudes",
        uidUser,
        "historial"
      );
      const solicitudesQuery = query(solicitudesRef);

      const unsubscribe = onSnapshot(solicitudesQuery, (snapshot) => {
        const solicitudes = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          if (data.estado === "Solicitado") {
            solicitudes.push(data);
          }
        });

        setDataClientesFactura(solicitudes);
        // console.log("data recibos", solicitudes);
      });

      return () => unsubscribe();
    } catch (error) {
      // console.error("Error al obtener los datos:", error.message);
    }
  };

  const getConfig = async () => {
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
        // console.error("Usuario no encontrado");
        return;
      }

      const userDocRef = doc(db, "usuarios", uidUser);

      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const valorMinimo = data.valorMinimo || 0;
          const PuntosporValor = data.PuntosporValor || 0;

          setValorMinimo(valorMinimo);
          setPuntosporValor(PuntosporValor);

          // console.log("data recibos", data);
        } else {
          // console.error("Documento no encontrado");
        }
      });

      return () => unsubscribe();
    } catch (error) {
      // console.error("Error al obtener los datos:", error.message);
    }
  };

  useEffect(() => {
    getConfig();
    fetchSolicitudes();
  }, [user]);

  const handleSubmitPuntos = async (e) => {
    e.preventDefault();

    const ConfigValores = {
      valorMinimo: compraValor,
      PuntosporValor: valorPuntos,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/config/set/valores/${identificador}`,
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
      setAlertMessage("Puntos configurados correctamente");
      setShowAlert(true);
      setCompraValor("");
      setValorPuntos("");
      closePuntosModal();
    } catch (error) {
      // console.error("Error configuring points:", error);
      setAlertMessage("Error configurando los puntos. Inténtalo nuevamente.");
      setShowErrorAlert(true);
    }
  };

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };
  const handleSearchClickPremio = () => {
    setSearchVisiblePremio(true);
  };

  const handleCloseClickPremio = () => {
    setSearchTermPremio("");
    setSearchVisiblePremio(false);
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
    // console.log("ddd", cliente);
  };

  const HandleAprovedCliente = async (cliente) => {
    const clienteAprobado = {
      estado: "Aprobado",
      nombre: cliente.nombre,
      puntos: Number(PuntosporValor),
    };

    console.info("Cliente", cliente.id, cliente.numerowp);

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/solicitud/actualizar/${identificador}/${cliente.id}/${cliente.numerowp}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteAprobado), // Convierte el objeto en una cadena JSON
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve client points");
      }

      setAlertMessage("Cliente aprobado correctamente");
      setShowAlert(true);
      closeEditModal();

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        // console.log("Response JSON:", result); // Maneja el resultado según sea necesario
      } else {
        const textResponse = await response.text(); // Lee la respuesta como texto
        // console.error("Non-JSON response:", textResponse); // Registra la respuesta no JSON
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      // console.error("Error approving client points:", error);
      setAlertMessage("Cliente aprobado correctamente.");
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

  const filterDataPremio = (
    Array.isArray(DataPremios) ? DataPremios : []
  ).filter((premio) => {
    const searchTerm = searchTermPremio.toLowerCase();
    return (
      (premio.nombre?.toLowerCase().includes(searchTerm) ?? false) ||
      (premio.descripcion?.toLowerCase().includes(searchTerm) ?? false) ||
      (premio.costoPuntos?.toString().includes(searchTerm) ?? false)
    );
  });

  const indexOfLastPremio = currentPagePremio * rowsPerPagePremio;
  const indexOfFirstPremio = indexOfLastPremio - rowsPerPagePremio;
  const CurrentPremio = filterDataPremio.slice(
    indexOfFirstPremio,
    indexOfLastPremio
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const paginatePremio = (pageNumber) => setCurrentPagePremio(pageNumber);

  //Obtener Premios del cliente
  const fetchPremios = async () => {
    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/premios/${identificador}`
      );
      const data = await response.json();
      setDataPremios(data);
      console.log(data);
    } catch (error) {
      setAlertMessage(
        "Error al obtener los datos. recarge la página e inténtalo nuevamente."
      );
      setShowErrorAlert(true);
    }
  };
  const IdPremio = DataPremios.id;
  useEffect(() => {
    fetchPremios();
  }, []);

  //Funcion para agregar premios
  const handleSubmitPremio = async (e) => {
    e.preventDefault();

    const newProduct = {
      nombre: NombrePremio,
      descripcion: DescripcionPremio,
      costoPuntos: CantidadPuntos,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/premios/new/${identificador}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (!response.ok) {
        setAlertMessage(
          "Error al registrar el producto. Inténtalo nuevamente."
        );
        setShowErrorAlert(true);
        ClosedModalPremios();
      } else {
        setAlertMessage("Premio configurado con éxito");
        setShowAlert(true);
        setNombrePremio("");
        setDescripcionPremio("");
        setCantidadPuntos("");
        ClosedModalPremios();
        fetchPremios();
      }
    } catch (error) {
      // console.error("Error registering product:", error);
    }
  };

  //editarPremios
  const openModalEditPremios = (premio) => {
    setselectPremioEdit(premio);
    setNombrePremio(premio.nombre);
    setCantidadPuntos(premio.costoPuntos);
    setDescripcionPremio(premio.descripcion);
    setPremioEdit(true);
    console.log("Editing prize:", premio); // Log to verify prize data
  };

  const ClosedModalEditPremios = () => {
    setPremioEdit(false);
    setselectPremioEdit(null);
  };

  const handleEditPremio = async (e) => {
    e.preventDefault();

    if (!selectPremioEdit) {
      console.error("No product to edit");
      return;
    }

    const updatedProduct = {
      ...selectPremioEdit,
      nombre: NombrePremio,
      descripcion: DescripcionPremio,
      costoPuntos: CantidadPuntos,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/premios/update/${identificador}/${selectPremioEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setAlertMessage("Producto actualizado con éxito");
      setShowAlert(true);
      ClosedModalEditPremios(); // Close the modal after a successful edit
      fetchPremios(); // Refresh the prize data
    } catch (error) {
      setAlertMessage("Error al editar el producto. Inténtalo nuevamente.");
      setShowErrorAlert(true);
      console.error("Error updating product:", error);
    }
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
            <div className="flex gap-4">
              {userPaquete === "JeicyPuntos" ? (
                  <>
                    <div
                className="bg-slate-50 cursor-pointer gap-2 p-2 flex justify-center items-center rounded-full"
                onClick={openModalPremios}
              >
                <FaBookOpen/>
               <p className="font-semibold text-base">
                Ver Acciones
                
                </p>
              </div>
                  
                  </>
               
              ) : (
                <>
                  <div className="bg-slate-50 px-10 py-2 cursor-pointer gap-2  text-2xl flex justify-center flex-col items-center rounded-xl">
                    <div className="flex justify-center items-center gap-4">
                      <p className="text-lg text-black font-medium ">
                        Valor Minimo
                      </p>
                      <BsCoin className="text-yellow-400" />
                    </div>
                    <p className="text-yellow-400 font-semibold">
                      {valorMinimo === ""
                        ? "0"
                        : Number(valorMinimo).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                    </p>
                  </div>

                  <div className="bg-slate-50 px-10 py-2 cursor-pointer gap-2  text-2xl flex justify-center flex-col items-center rounded-xl">
                    <div className="flex justify-center items-center gap-4">
                      <p className="text-lg text-black font-medium ">Puntos</p>
                      <FaCoins className="text-yellow-400" />
                    </div>
                    <p className="text-yellow-400 font-semibold">
                      {PuntosporValor === "" ? "0" : PuntosporValor}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Modal
              nombre="Configurar Puntos"
              isOpen={PuntosModalOpen}
              onClose={closePuntosModal}
              size="auto"
              Fondo="auto"
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
          <div className="flex justify-center items-center gap-6">
            <Tooltip content="Configurar Puntos">
              <div
                className="bg-slate-50 cursor-pointer gap-2 p-2 text-2xl flex justify-center items-center rounded-full"
                onClick={openPuntosModal}
              >
                <IoSettingsSharp className="text-yellow-500" />
              </div>
            </Tooltip>
            <Tooltip content="Configurar Premios">
              <div
                className="bg-slate-50 cursor-pointer gap-2 p-2 text-2xl flex justify-center items-center rounded-full"
                onClick={openModalPremios}
              >
                <BsGiftFill className="text-red-600" />
              </div>
            </Tooltip>
          </div>
          <Modal
            acciononClick={openModalViewPremios}
            nombre={"Configurar Premios"}
            conteTooltip={"Ver Premios"}
            accion={<IoEye className="text-indigo-700 hover:text-white" />}
            isOpen={Openmodalpremios}
            onClose={ClosedModalPremios}
            size="auto"
            Fondo="auto"
          >
            <form className="space-y-4 my-10" onSubmit={handleSubmitPremio}>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  htmlFor="number"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre Premio
                </label>
                <input
                  type="text"
                  onChange={(e) => setNombrePremio(e.target.value)}
                  value={NombrePremio}
                  id="NombrePremio"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  htmlFor="number"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Descripción del premio
                </label>
                <input
                  type="text"
                  onChange={(e) => setDescripcionPremio(e.target.value)}
                  value={DescripcionPremio}
                  id="DescripcionPremio"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  htmlFor="number"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Cantidad de puntos
                </label>
                <input
                  type="number"
                  onChange={(e) => setCantidadPuntos(e.target.value)}
                  value={CantidadPuntos}
                  id="CantidadPuntos"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Configurar Premios
              </button>
            </form>
          </Modal>

          <Modal
            nombre="Premios"
            isOpen={openViewPremios}
            onClose={ClosedModalViewPremios}
            size="fixed"
            Fondo="auto"
          >
            <div className="col-span-2 relative overflow-x-auto shadow-md mx-4 sm:rounded-lg">
              <div className="flex justify-between items-center p-4">
                <div className="flex gap-4">
                  {!searchVisiblePremio && (
                    <div>
                      <Tooltip content="Buscar Premio">
                        <div
                          className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full"
                          onClick={handleSearchClickPremio}
                        >
                          <IoSearch />
                        </div>
                      </Tooltip>
                    </div>
                  )}
                  {searchVisiblePremio && (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={searchTermPremio}
                        onChange={(e) => setSearchTermPremio(e.target.value)}
                        className="p-2 border  border-gray-300 rounded-full"
                        placeholder="Buscar orden..."
                      />
                      <div
                        className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full ml-2"
                        onClick={handleCloseClickPremio}
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
                    <th scope="col" className="px-4 py-3">
                      Nombre del premio
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Descripción del premio
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Cantidad de puntos por premio
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CurrentPremio.length === 0 ? (
                    <p className="text-center text-xs mx-10   flex justify-center items-center mt-10 mb-10">
                      No hay premios disponibles por favor agregue un premio
                    </p>
                  ) : (
                    CurrentPremio.map((premio, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                          {premio.nombre}
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                          {premio.descripcion}
                        </td>
                        <td className="px-4  py-4 font-semibold text-gray-900 dark:text-white">
                          {premio.costoPuntos}
                        </td>
                        <td className="px-3 py-4 flex gap-2">
                          <Tooltip content="Editar">
                            <button
                              type="button"
                              onClick={()=>openModalEditPremios(premio)}
                              className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                            >
                              <FaRegEdit />
                            </button>
                          </Tooltip>
                          <Modal
                            nombre={"Actualizar Premio"}
                            isOpen={PremioEdit}
                            onClose={ClosedModalEditPremios}
                            size="auto"
                          >
                            <form
                              className="space-y-4 my-10 "
                              onSubmit={handleEditPremio}
                            >
                              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                  htmlFor="number"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Nombre Premio
                                </label>
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    setNombrePremio(e.target.value)
                                  }
                                  value={NombrePremio}
                                  id="NombrePremio"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                />
                              </div>
                              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                  htmlFor="number"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Descripción del premio
                                </label>
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    setDescripcionPremio(e.target.value)
                                  }
                                  value={DescripcionPremio}
                                  id="DescripcionPremio"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                />
                              </div>
                              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                  htmlFor="number"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Cantidad de puntos
                                </label>
                                <input
                                  type="number"
                                  onChange={(e) =>
                                    setCantidadPuntos(e.target.value)
                                  }
                                  value={CantidadPuntos}
                                  id="CantidadPuntos"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                Configurar Premios
                              </button>
                            </form>
                          </Modal>
                          <Tooltip content="Eliminar">
                            <button
                              type="button"
                              // onClick={() => openModall(product)}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                              <FaRegTrashAlt />
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
                  onClick={() => paginatePremio(currentPagePremio - 1)}
                  disabled={currentPagePremio === 1}
                  className="p-2 border border-gray-300 rounded"
                >
                  Anterior
                </button>
                <span>{`Page ${currentPagePremio} of ${Math.ceil(
                  filterDataPremio.length / rowsPerPagePremio
                )}`}</span>
                <button
                  onClick={() => paginatePremio(currentPagePremio + 1)}
                  disabled={
                    currentPagePremio ===
                    Math.ceil(filterDataPremio.length / rowsPerPagePremio)
                  }
                  className="p-2 border border-gray-300 rounded"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </Modal>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th scope="col" className="px-6 py-3">
                Id
              </th>
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
                  {cliente.id}
                </td>
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
          Fondo="auto"
        >
          {selectCliente && (
            <div className="grid grid-cols-2 gap-10 item-center">
              <div className="flex justify-center flex-col">
                <img className="h-96 w-86" src={`${selectCliente.recibo}`} />
              </div>
              <div className="flex flex-col gap-6 place-content-center item-center">
                {/* <p className="font-semibold text-title">
                  ID Cliente: {selectCliente.id}
                </p> */}
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
