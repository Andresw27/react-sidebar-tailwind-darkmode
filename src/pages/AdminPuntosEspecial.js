import React, { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { IoSearch, IoClose, IoSettingsSharp } from "react-icons/io5";
import { Tooltip } from "@material-tailwind/react";
import { FaCoins, FaBookOpen } from "react-icons/fa";
import { auth } from "../firebase-config";
import { FaCrown } from "react-icons/fa";

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
  const [dataAcciones, setDataAcciones] = useState([])
  const [selectedAction, setSelectedAction] = useState("");

  const [rowsPerPage] = useState(5);
  const [searchVisible, setSearchVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [PuntosModalOpen, setPuntosModalOpen] = useState(false);
  const [selectCliente, setSelectCliente] = useState(null);

  //estados de acciones
  const [puntosAccion, setpuntosAccion] = useState("");
  const [nombreAccion, setnombreAccion] = useState("");
  const [descripcionAccion, setDescripcionAccion] = useState("")

  //estados de premios globales y normales crear
  const [NewnombrePremioGlobal, setNewnombrePremioGlobal] = useState("")
  const [NewdescripcionPremioGlobal, setNewdescripcionPremioGlobal] = useState("")
  const [NewpuntosPremioGlobal,setNewPuntosPremioGlobal]=useState("")

  //estados premios especificos nuevos crear
  const [NewnombrePremioEspe, setNewnombrePremioEspe] = useState("")
  const [NewdescripcionPremioEspe, setNewdescripcionPremioEspe] = useState("")
  const [NewpuntosPremioEspe,setNewPuntosPremioEspe]=useState("")


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
  const [ModarAcciones, setModalAcciones] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openModalPremioGlobal, setopenModalPremioGlobal] = useState("")

  // console.log("accione seleccionada2 ",selectedAction)


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userAuth = auth.currentUser;
  //       if (userAuth) {
  //         const userData = await fetchUserData(userAuth.uid);

  //         setUserPaquete(userData.paquete);
  //         console.log(userPaquete, "ddssss");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };


  //modal para configurar premios globales

  const openModalpremiosGlobal = () => {

    setopenModalPremioGlobal(true);
    setDropdownOpen(false);
  }

  const ClosedModalpremiosGlobal = () => {

    setopenModalPremioGlobal(false);
  }



  //modal para abrir y ver acciones
  const openModalAcciones = () => {
    setModalAcciones(true);
  };

  const CloseModalAcciones = () => {
    setModalAcciones(false);
  };

  //modal para los configurar premios
  const openModalPremios = () => {
    setOpenModalPremios(true);
    setDropdownOpen(false);
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

      const accionesRef = collection(
        db,
        "solicitudes",
        uidUser,
        "historial",where("tipo", "!=", "Redencion Premios")
      );
      const accionesQuery = query(accionesRef);

      const unsubscribe = onSnapshot(accionesQuery, (snapshot) => {
        const solicitudes = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          if (data.estado === "Solicitado") {
            solicitudes.push(data);
          }
        });

        setDataClientesFactura(solicitudes);
        console.log("data recibos", solicitudes);
      });

      return () => unsubscribe();
    } catch (error) {
      // console.error("Error al obtener los datos:", error.message);
    }
  };

  const fetchAccciones = async () => {
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

      const accionesRef = collection(db, "usuarios", uidUser, "acciones");

      const accionesQuery = query(accionesRef);

      const unsubscribe = onSnapshot(accionesQuery, (snapshot) => {
        const acciones = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          acciones.push({
            id: doc.id,
            ...data
          });
        });

        setDataAcciones(acciones);
        console.log("acciones", acciones);
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
    fetchAccciones();
  }, [user]);

  const handleSubmitActions = async (e) => {
    e.preventDefault();

    const formDataActions = {
      nombre: nombreAccion,
      puntos: puntosAccion,
      descripcion: descripcionAccion
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/actions/${identificador}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataActions),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to configure points");
      }
      setAlertMessage("Puntos configurados correctamente");
      setShowAlert(true);
      setnombreAccion("");
      setpuntosAccion("");
      setDescripcionAccion("")
      closePuntosModal();
    } catch (error) {
      // console.error("Error configuring points:", error);
      setAlertMessage("Error configurando los puntos. Inténtalo nuevamente.", error.message);
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
  const openPuntosModal = () => {
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
    console.log("Cliente aprobado", cliente, "accion seleccionada", selectedAction);

    const clienteAprobado = {
      fecha: "10/08/2024",
      nombre: cliente.nombre,
      puntos: selectedAction,
      estado: "Aprobado",
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

      const userDocRef = collection(db, "usuarios", uidUser, "premios");
      const premiosGlobalesDocRef = doc(db, "premiosGlobales", uidUser);

      const premios = [];


      const unsubscribe1 = onSnapshot(premiosGlobalesDocRef, (doc) => {
        if (doc.exists()) {
          premios.push({
            tipo: "global",
            id: doc.id,
            ...doc.data()
          });
        } else {
          console.error("No se encontraron premios globales.");
        }
      });


      const unsubscribe2 = onSnapshot(userDocRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          premios.push({
            id: doc.id,
            ...doc.data()});
        });
      });

      console.log("premios: ", premios)
      setDataPremios(premios)

      return { premios, unsubscribe1, unsubscribe2 };
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
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
      nombre: NewnombrePremioEspe,
      descripcion: NewdescripcionPremioEspe,
      costoPuntos: NewpuntosPremioEspe,
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
        setNombrePremio("");
        setDescripcionPremio("");
        setCantidadPuntos("");
        ClosedModalPremios();
        fetchPremios();
      } else {
        setAlertMessage("Premio configurado con éxito");
        setShowAlert(true);
        setNewnombrePremioEspe("");
        setNewdescripcionPremioEspe("");
        setNewPuntosPremioEspe("");
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
    console.log("selectedPremio:", selectPremioEdit )
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
              <div
                className="bg-slate-50 cursor-pointer gap-2 p-2 flex justify-center items-center rounded-full"
                onClick={openModalAcciones}
              >
                <FaBookOpen />
                <p className="font-semibold text-base">Ver Acciones</p>
              </div>
              <Modal
                size="fixed"
                isOpen={ModarAcciones}
                onClose={CloseModalAcciones}
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
                            onChange={(e) =>
                              setSearchTermPremio(e.target.value)
                            }
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
                          Nombre Accion
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Descripción Accion
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Cantidad de puntos por accion
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataAcciones.length === 0 ? (
                        <p className="text-center text-xs mx-10   flex justify-center items-center mt-10 mb-10">
                          No hay acciónes configuradas actualmente, por favor
                          configuré una acción
                        </p>
                      ) : (
                        dataAcciones.map((premio, index) => (
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
                              {premio.puntos}
                            </td>
                            <td className="px-3 py-4 flex gap-2">
                              <Tooltip content="Editar">
                                <button
                                  type="button"
                                  onClick={() => openModalEditPremios(premio)}
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
                                      Descripción Premio
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
                                      Cantidad de puntos por accion
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
                                    Actualizar Accion
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
          </div>
          <div className="flex justify-center items-center gap-6">
            <Tooltip content="Configurar Acciones">
              <div
                className="bg-slate-50 cursor-pointer gap-2 p-2 text-2xl flex justify-center items-center rounded-full"
                onClick={openPuntosModal}
              >
                <IoSettingsSharp className="text-yellow-500" />
              </div>
            </Tooltip>
            <Modal
              nombre="Configurar Acciones"
              isOpen={PuntosModalOpen}
              onClose={closePuntosModal}
              size="auto"
              Fondo="auto"
            >
              <form className="space-y-6 my-5 px-2" onSubmit={handleSubmitActions}>
                <div>
                  <label
                    htmlFor="nombreAccion"
                    className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                  >
                    Nombre de la Acción
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setnombreAccion(e.target.value)}
                    value={nombreAccion}
                    id="nombreAccion"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingresa el nombre de la acción"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="descripcionAccion"
                    className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                  >
                    Descripción de la Acción
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setDescripcionAccion(e.target.value)}
                    value={descripcionAccion}
                    id="descripcionAccion"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe brevemente la acción"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="puntos"
                    className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                  >
                    Cantidad de Puntos por Acción
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setpuntosAccion(e.target.value)}
                    value={puntosAccion}
                    id="puntos"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Especifica los puntos por acción"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  Configurar Acción
                </button>
              </form>
            </Modal>


            <Tooltip content="Configurar Premios">
              <div
                className="bg-slate-50 cursor-pointer gap-2 p-2 text-2xl flex justify-center items-center rounded-full"
                id="dropdownAvatarNameButton"
                onClick={handleDropdownToggle}
              >
                <BsGiftFill className="text-red-600" />
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </div>
            </Tooltip>
          </div>

          <Modal
            acciononClick={openModalViewPremios}
            nombre={"Configurar Premios Específicos"}
            conteTooltip={"Ver Premios"}
            accion={<IoEye className="text-indigo-700 hover:text-white" />}
            isOpen={Openmodalpremios}
            onClose={ClosedModalPremios}
            size="auto"
            Fondo="auto"
          >
            <form className="space-y-6 my-8 px-6" onSubmit={handleSubmitPremio}>
              <div className="md:w-full mb-4">
                <label
                  htmlFor="NombrePremio"
                  className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                >
                  Nombre del Premio
                </label>
                <input
                  type="text"
                  onChange={(e) => setNewnombrePremioEspe(e.target.value)}
                  value={NewnombrePremioEspe}
                  id="NombrePremio"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingresa el nombre del premio"
                  required
                />
              </div>

              <div className="md:w-full mb-4">
                <label
                  htmlFor="DescripcionPremio"
                  className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                >
                  Descripción del Premio
                </label>
                <input
                  type="text"
                  onChange={(e) => setNewdescripcionPremioEspe(e.target.value)}
                  value={NewdescripcionPremioEspe}
                  id="DescripcionPremio"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe brevemente el premio"
                  required
                />
              </div>

              <div className="md:w-full mb-6">
                <label
                  htmlFor="CantidadPuntos"
                  className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                >
                  Cantidad de Puntos
                </label>
                <input
                  type="number"
                  onChange={(e) => setNewPuntosPremioEspe(e.target.value)}
                  value={NewpuntosPremioEspe}
                  id="CantidadPuntos"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Especifica los puntos requeridos"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
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
            <div className="col-span-2 relative overflow-x-auto shadow-md mx-4 sm:rounded-lg ">
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
                      Nombre
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Descripción
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Cantidad de puntos
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Acciónnnnn
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CurrentPremio.length === 0 ? (
                    <p className="text-center text-xs mx-10   flex justify-center items-center mt-10 mb-10">
                      No hay acciónes configuradas actualmente, por favor
                      configuré una acción
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
                          {premio.tipo === "global" ? (<FaCrown />) : null} {premio.costoPuntos}
                        </td>
                        <td className="px-3 py-4 flex gap-2">
                          <Tooltip content="Editar">
                            <button
                              type="button"
                              onClick={() => openModalEditPremios(premio)}
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
                                  Nombre 
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
                                  Descripción
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
                                Actualizar
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
        {dropdownOpen && (
          <div
            id="dropdownAvatarName"
            className="z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute right-1  "
          >
            <span
              onClick={openModalPremios}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">

              Premios Especificos
            </span>

            <div className="py-2">
              <span
                onClick={openModalpremiosGlobal}

                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">
                Premio Global
              </span>
            </div>
          </div>
        )}
        <Modal
          // acciononClick={openModalViewPremios}
          nombre={"Configurar Premio Global"}
          conteTooltip={"Ver Premios"}
          accion={<IoEye className="text-indigo-700 hover:text-white" />}
          isOpen={openModalPremioGlobal}
          onClose={ClosedModalpremiosGlobal}
          size="auto"
          Fondo="auto"
        >
          <form className="space-y-4 my-10" onSubmit={handleSubmitPremio}>
            <div className="md:w-full px-3 mb-6 md:mb-0">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div className="md:w-full px-3 mb-6 md:mb-0">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div className="md:w-full px-3 mb-6 md:mb-0">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Configurar Premio
            </button>
          </form>
        </Modal>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  h-80">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3">
                Número whatsapp
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre cliente
              </th>
              <th scope="col" className="px-6 py-3">
                Descripción
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Acción
              </th> */}
              <th scope="col" hidden className="px-6 py-3">
                Url Factura
              </th>
              <th
                scope="col"
                hidden={userPaquete != "JeicyEspecial" ? true : false}
                className="px-6 py-3"
              >
                Estado
              </th>
              <th scope="col" className="px-6 py-3">
                Validar
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
                  {cliente.idSolicitud}
                </td>
                <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.fecha}
                </td>
                <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.numerowp}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.nombre}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.descripcion}
                </td>

                {/* <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.descripcion}
                </td> */}
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  Validar accion
                </td>
                {/* <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {cliente.descripcion}
                </td> */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start p-6">
              <div className="flex justify-center flex-col">
                <img className="h-96 w-86" src={`${selectCliente.recibo}`} />
              </div>
              <div className="flex flex-col gap-6 bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">Nombre Cliente:</p>
                  <p className="text-lg text-gray-800">{selectCliente.nombre}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">Número WhatsApp:</p>
                  <p className="text-lg text-gray-800">{selectCliente.numerowp}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">Descripción:</p>
                  <p className="text-lg text-gray-800">{selectCliente.descripcion}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">Seleccionar Acción:</p>
                  <select
                    className="border rounded p-2 text-gray-800"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  >
                    <option value="">Seleccione una acción</option>
                    {dataAcciones.map((accion) => (
                      <option key={accion.id} value={accion.puntos}>
                        {accion.nombre} - {accion.puntos} puntos
                      </option>
                    ))}
                  </select>
                  {selectedAction === "" && (
                    <p className="text-sm text-red-600 mt-1">Debe seleccionar una acción para continuar.</p>
                  )}
                </div>

                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => HandleAprovedCliente(selectCliente)}
                    className={`p-2 rounded w-full text-white ${selectedAction ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!selectedAction}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleDecline(selectCliente)}
                    className="bg-red-800 hover:bg-red-900 text-white p-2 rounded w-full"
                  >
                    Declinar
                  </button>
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
