import React, { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { IoSearch, IoClose, IoSettingsSharp } from "react-icons/io5";
import { Tooltip } from "@material-tailwind/react";
import { FaCoins, FaBookOpen } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

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
  getDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useSelector } from "react-redux";

function AdminPuntos() {
  const [comentario, setComentario] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermPremio, setSearchTermPremio] = useState("");
  const [searchVisiblePremio, setSearchVisiblePremio] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePremio, setCurrentPagePremio] = useState(1);
  const [rowsPerPagePremio] = useState(4);
  const [dataAcciones, setDataAcciones] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");

  const [rowsPerPage] = useState(5);
  const [searchVisible, setSearchVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [PuntosModalOpen, setPuntosModalOpen] = useState(false);
  const [selectCliente, setSelectCliente] = useState(null);

  //estados de acciones
  const [selectAccion, setSelectAccion] = useState("");
  const [AccionEdit, setAccionEdit] = useState("");
  //estados para actualizar acciones
  const [puntosAccion, setpuntosAccion] = useState("");
  const [nombreAccion, setnombreAccion] = useState("");
  const [descripcionAccion, setDescripcionAccion] = useState("");

  //estados para agregar acciones
  const [newNombreAccion, setNewNombreAccion] = useState("");
  const [newDescripcionAccion, setNewDescripcionAccion] = useState("");
  const [newPuntosAccion, setNewPuntosAccion] = useState("");

  //estados de premios globales y normales crear
  const [NewnombrePremioGlobal, setNewnombrePremioGlobal] = useState("");
  const [NewdescripcionPremioGlobal, setNewdescripcionPremioGlobal] =
    useState("");
  const [NewpuntosPremioGlobal, setNewPuntosPremioGlobal] = useState("");

  //estados premios especificos nuevos crear
  const [NewnombrePremioEspe, setNewnombrePremioEspe] = useState("");
  const [NewdescripcionPremioEspe, setNewdescripcionPremioEspe] = useState("");
  const [NewpuntosPremioEspe, setNewPuntosPremioEspe] = useState("");

  //estados modal eliminar accion
  const [openModalDeleteAccion, setOpenModalDeleteAccion] = useState("");
  const [SelectDeleteAccion, setSelectDeleteAccion] = useState("");

  //estados para eliminar premio
  const [selectPremioDelete, setSelectPremioDelete] = useState("");
  const [openModalDeletePremio, setModalDeletePremio] = useState("");

  //estado fetch hook Notificaciones
  const [formData, setFormData] = useState([]);

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
  const { identificador, idBot, naceptado, nrechazado, webhook } = useSelector(
    (state) => state.user
  );
  const [dataClientesFactura, setDataClientesFactura] = useState([]);
  const [PremioEdit, setPremioEdit] = useState("");
  const [selectPremioEdit, setselectPremioEdit] = useState(null);
  const [userPaquete, setUserPaquete] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [ModarAcciones, setModalAcciones] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openModalPremioGlobal, setopenModalPremioGlobal] = useState("");
  //Estado Premio GLobal
  const [PremioGlobal, setPremioGlobal] = useState("");
  // console.log("accione seleccionada2 ",selectedAction)

  //opcion para limpiar select
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const selectedName =
      e.target.options[e.target.selectedIndex].text.split(" - ")[0];

    setSelectedAction(selectedValue); // Set the points
    setSelectAccion(selectedName); // Set the name
  };

  const handleClearSelection = () => {
    setSelectedAction("");
    setSelectAccion("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userAuth = auth.currentUser;
        if (userAuth) {
          const userData = await fetchUserData(userAuth.uid);

          setUsuario(userData);
          console.log(usuario.nombreEmpresa, "ddssss");
          console.log(userData.idBot, "bot");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  //modal para configurar premios globales

  const openModalpremiosGlobal = () => {
    setopenModalPremioGlobal(true);
    setDropdownOpen(false);
  };

  const ClosedModalpremiosGlobal = () => {
    setopenModalPremioGlobal(false);
  };

  //modal para abrir y ver acciones
  const openModalAcciones = () => {
    setModalAcciones(true);
    setDropdownOpen(false);
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
      // Consulta para obtener el UID del usuario basado en el identificador
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

      // Referencia a la colección de solicitudes del usuario
      const accionesRef = collection(db, "solicitudes", uidUser, "historial");

      // Consulta para filtrar por estado y tipo
      const accionesQuery = query(
        accionesRef,
        where("estado", "==", "Solicitado"),
        where("tipo", "==", "especial")
      );

      const unsubscribe = onSnapshot(accionesQuery, async (snapshot) => {
        const solicitudes = [];

        // Utiliza un bucle for...of para manejar operaciones asíncronas
        for (const doc of snapshot.docs) {
          const data = doc.data();
          data.id = doc.id;

          // Llama a fetchContentType para obtener el content-type
          data.contentType = await fetchContentType(data.recibo);

          solicitudes.push(data);
        }

        setDataClientesFactura(solicitudes);
        console.log("data recibos", solicitudes);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  const fetchContentType = async (url) => {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      console.log(contentType, "dd");

      return contentType;
    } catch (error) {
      console.error(`Error fetching content-type for URL: ${url}`, error);
      return "Fetch failed";
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
            ...data,
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
      nombre: newNombreAccion,
      puntos: newPuntosAccion,
      descripcion: newDescripcionAccion,
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
        setAlertMessage("Error configurando la accion. Inténtalo nuevamente.");
        setShowErrorAlert(true);

        throw new Error("Failed to configure points");
      }
      setAlertMessage("Accion configurada correctamente");
      setShowAlert(true);
      setNewDescripcionAccion("");
      setNewPuntosAccion("");
      setNewNombreAccion("");
      closePuntosModal();
    } catch (error) {
      // console.error("Error configuring points:", error);
      setAlertMessage(
        "Error configurando la accion. Inténtalo nuevamente.",
        error.message
      );
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
    console.log(cliente, "cliente");
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setComentario("");
    setSelectedAction("");
  };

  //Modal configurar puntos
  const openPuntosModal = () => {
    setPuntosModalOpen(true);
    setDropdownOpen(false);
  };

  const closePuntosModal = () => {
    setPuntosModalOpen(false);
  };
  //funcion declinar
  // const handleDecline = (cliente) => {
  //   setDataClientesFactura((prevData) =>
  //     prevData.filter((item) => item.idCliente !== cliente.idCliente)
  //   );
  //   closeEditModal();
  //   // console.log("ddd", cliente);
  // };
  //aprobar solicitud de puntos

  const HandleAprovedCliente = async (cliente, estado, comentario) => {
    console.log(
      "Cliente aprobado",
      cliente,
      "acción seleccionada",
      selectedAction
    );
    console.log(estado, "estado");

    const clienteAprobado = {
      nombre: cliente.nombre,
      puntos: selectedAction,
      estado: estado,
    };

    // Definimos formData directamente aquí, en lugar de usar setFormData
    const formData = {
      idBot: idBot,
      nombre: cliente.nombre,
      celular: cliente.numerowp,
      idSolicitud: cliente.idSolicitud,
      puntos: selectedAction,
      accion: selectAccion,
      flag: estado === "Aceptado" ? "1" : "3",
      plantilla: estado === "Aceptado" ? naceptado : nrechazado,
      comentario: comentario,
    };

    try {
      // Primer fetch para enviar el formData
      const response1 = await fetch(
        "https://hook.us1.make.com/39p4vx3px9r7xl4myp3hcmvoonucp39t",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response1.ok) {
        throw new Error("Error en el envío del formulario");
      } else {
        console.log("solicitud bien", formData);
      }

      // Segundo fetch para actualizar la solicitud
      const response2 = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/solicitud/actualizar/${identificador}/${cliente.id}/${cliente.numerowp}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteAprobado),
        }
      );

      if (!response2.ok) {
        throw new Error("Error al actualizar la solicitud");
      }

      closeEditModal();
      setAlertMessage("Cliente aprobado correctamente");
      setShowAlert(true);
    } catch (error) {
      console.error("Error approving client points:", error);
      setAlertMessage("Error en el proceso de aprobación.");
      setShowAlert(true);
    } finally {
      // Siempre cierra el modal, ya sea que la operación haya sido exitosa o haya fallado
      closeEditModal();
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
  // Obtener Premios del cliente
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
            ...doc.data(),
          });
        } else {
          console.error("No se encontraron premios globales.");
        }
      });

      const unsubscribe2 = onSnapshot(userDocRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          premios.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });

      console.log("premios: ", premios);
      setDataPremios(premios);

      return { premios, unsubscribe1, unsubscribe2 };
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  // Obtiene el premio global del cliente
  const obtenerPremioGlobal = async (identificador) => {
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
        return null;
      }

      const premiosGlobalesDocRef = doc(db, "premiosGlobales", uidUser);

      const premioGlobal = await getDoc(premiosGlobalesDocRef); // Cambiado a getDoc

      if (premioGlobal.exists()) {
        const premioGlobalData = {
          tipo: "global",
          id: premioGlobal.id,
          ...premioGlobal.data(),
        };
        console.log("Premio Global: ", premioGlobalData);
        return premioGlobalData;
      } else {
        console.error("No se encontró un premio global.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el premio global:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchPremioGlobal = async () => {
      const premioData = await obtenerPremioGlobal(identificador);
      setPremioGlobal(premioData);
    };

    if (identificador) {
      fetchPremioGlobal();
      fetchPremios(identificador);
    }
  }, [identificador]); // Asegúrate de que identificador esté en las dependencias

  const IdPremio = DataPremios.id;

  //Funcion para agregar premios Especifico
  const handleSubmitPremioEspecifico = async (e) => {
    e.preventDefault();

    const newProduct = {
      nombre: NewnombrePremioEspe,
      descripcion: NewdescripcionPremioEspe,
      costoPuntos: NewpuntosPremioEspe,
      nombreRestaurante: usuario.nombreEmpresa,
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

  //Funcion para agregar premio Global
  const handleSubmitPremioGlobal = async (e) => {
    e.preventDefault();

    const newPremioGlobal = {
      nombre: NewnombrePremioGlobal,
      descripcion: NewdescripcionPremioGlobal,
      costoPuntos: NewpuntosPremioGlobal,
      nombreRestaurante: usuario.nombreEmpresa,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/premioGlobal/new/${identificador}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPremioGlobal),
        }
      );

      if (!response.ok) {
        setAlertMessage(
          "Error al registrar el producto. Inténtalo nuevamente."
        );
        setShowErrorAlert(true);
      } else {
        setAlertMessage("Premio configurado con éxito");
        setPremioGlobal(newPremioGlobal);

        setShowAlert(true);
        setNewnombrePremioGlobal("");
        setNewdescripcionPremioGlobal("");
        setNewPuntosPremioGlobal("");
        ClosedModalpremiosGlobal();
        fetchPremios();
      }
    } catch (error) {
      console.error("Error registering product:", error);
    }
  };

  //editarPremios
  const openModalEditPremios = (premio) => {
    setselectPremioEdit(premio);
    console.log(premio.tipo);
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
  //editar premio especifico
  const handleEditPremio = async () => {
    if (!selectPremioEdit) {
      console.error("No hay premio para editar");
      return;
    }

    const updatedProduct = {
      ...selectPremioEdit,
      nombre: NombrePremio,
      descripcion: DescripcionPremio,
      costoPuntos: CantidadPuntos,
    };

    if (selectPremioEdit.tipo != "global") {
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
          throw new Error("Error al actualizar el premio específico");
        }

        setAlertMessage("Premio actualizado con éxito");
        setShowAlert(true);
        ClosedModalEditPremios();
        fetchPremios();
      } catch (error) {
        setAlertMessage("Error al actualizar el premio. Inténtalo nuevamente.");
        setShowErrorAlert(true);
        console.error("Error actualizando el premio:", error);
      }
    } else {
      const updatedProduct = {
        ...selectPremioEdit,
        nombre: NombrePremio,
        descripcion: DescripcionPremio,
        costoPuntos: CantidadPuntos,
      };
      try {
        const response = await fetch(
          `https://us-central1-jeicydelivery.cloudfunctions.net/app/premioGlobal/update/${identificador}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el premio global");
        }

        setAlertMessage("Premio global actualizado con éxito");
        setShowAlert(true);
        ClosedModalEditPremios();
        fetchPremios();
      } catch (error) {
        setAlertMessage(
          "Error al actualizar el premio global. Inténtalo nuevamente."
        );
        setShowErrorAlert(true);
        console.error("Error actualizando el premio global:", error);
      }
    }
  };

  //editar premioGlobal
  const handleEditPremioGlobal = async () => {
    if (!selectPremioEdit) {
      console.error("No hay premio para editar");
      return;
    }

    const updatedPremioGlobal = {
      ...selectPremioEdit,
      nombre: NombrePremio,
      descripcion: DescripcionPremio,
      costoPuntos: CantidadPuntos,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/premioGlobal/update/${identificador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPremioGlobal),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el premio global");
      }

      setAlertMessage("Premio global actualizado con éxito");
      setShowAlert(true);
      ClosedModalEditPremios();
      fetchPremios();
    } catch (error) {
      setAlertMessage(
        "Error al actualizar el premio global. Inténtalo nuevamente."
      );
      setShowErrorAlert(true);
      console.error("Error actualizando el premio global:", error);
    }
  };
  const openModalEditAcciones = (accion) => {
    setSelectAccion(accion);
    setnombreAccion(accion.nombre);
    setpuntosAccion(accion.puntos);
    setDescripcionAccion(accion.descripcion);
    setAccionEdit(true);
    console.log("Editing accion:", accion); // Log to verify prize data
  };

  const ClosedModalEditAcciones = () => {
    setAccionEdit(false);
    setSelectAccion(null);
  };

  //funcion editar accion
  const handleEditaAccion = async (e) => {
    e.preventDefault();
  
    if (!selectAccion) {
      console.error("No product to edit");
      return;
    }
  
    const updatedProduct = {
      ...selectAccion,
      nombre: nombreAccion,
      descripcion: descripcionAccion,
      puntos: puntosAccion,
    };
  
    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/actions/update/${identificador}/${selectAccion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
  
      if (!response.ok) {
        setAlertMessage("Error al eliminar el producto. Inténtalo nuevamente.");
        setShowErrorAlert(true);
      } else {
        setAlertMessage("Accion eliminada con éxito");
        setShowAlert(true);
        fetchAccciones();
        // Cerrar el modal solo si la actualización fue exitosa
        ClosedModalEditAcciones();
      }
    } catch (error) {
      console.error("Error updating action:", error);
    }
  };
  
  //modal para eliminar acciones

  const OpenDeleteAccionModal = (accion) => {
    setSelectDeleteAccion(accion);
    setOpenModalDeleteAccion(true);
    console.log(accion, "accionDelete");
  };

  const ClosedDeleteAccionModal = () => {
    setSelectDeleteAccion(null);
    setOpenModalDeleteAccion(false);
  };

  // funcion para eliminar accion
  const handleDeleteAccion = async () => {
    if (!SelectDeleteAccion) return;

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/actions/delete/${identificador}/${SelectDeleteAccion.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setAlertMessage("Error al eliminar el producto. Inténtalo nuevamente.");
        setShowErrorAlert(true);
        ClosedDeleteAccionModal();
      }

      setAlertMessage("Accion eliminada con éxito");
      setShowAlert(true);
      fetchAccciones();
      ClosedDeleteAccionModal();
    } catch (error) {}
  };

  //modals y funcion para delete premio

  const openModalPremio = (premio) => {
    setSelectPremioDelete(premio);
    setModalDeletePremio(true);
    console.log("premiodelete", premio);
  };
  const ClosedModalPremio = () => {
    setSelectPremioDelete(null);
    setModalDeletePremio(false);
  };
  const handleDeletePremio = async () => {
    if (!selectPremioDelete) return;

    console.log("selececrte", selectPremioDelete);

    if (selectPremioDelete.tipo != "global") {
      try {
        const response = await fetch(
          `https://us-central1-jeicydelivery.cloudfunctions.net/app/premios/eliminar/${identificador}/${selectPremioDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          setAlertMessage("Error al eliminar el premio. Inténtalo nuevamente.");
          setShowErrorAlert(true);
          ClosedModalPremio();
        }

        setAlertMessage("Premio eliminado con éxito");
        setShowAlert(true);
        fetchPremios();
        ClosedModalPremio();
      } catch (error) {}
    } else {
      try {
        const response = await fetch(
          `https://us-central1-jeicydelivery.cloudfunctions.net/app/premioGlobal/delete/${identificador}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          setAlertMessage("Error al eliminar el premio. Inténtalo nuevamente.");
          setShowErrorAlert(true);
          ClosedModalPremio();
        }

        setAlertMessage("Premio Global eliminado con éxito");
        setShowAlert(true);
        setPremioGlobal(null);
        fetchPremios();
        ClosedModalPremio();
      } catch (error) {}
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
                        dataAcciones.map((accion, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                              {accion.nombre}
                            </td>
                            <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                              {accion.descripcion}
                            </td>
                            <td className="px-4  py-4 font-semibold text-gray-900 dark:text-white">
                              {accion.puntos}
                            </td>
                            <td className="px-3 py-4 flex gap-2">
                              <Tooltip content="Editar">
                                <button
                                  type="button"
                                  onClick={() => openModalEditAcciones(accion)}
                                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                                >
                                  <FaRegEdit />
                                </button>
                              </Tooltip>
                              <Modal
                                nombre={"Actualizar Accion"}
                                isOpen={AccionEdit}
                                onClose={ClosedModalEditAcciones}
                                size="auto"
                                Fondo="auto"
                              >
                                <form
                                  className="space-y-4 my-10 "
                                  onSubmit={handleEditaAccion}
                                >
                                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label
                                      htmlFor="number"
                                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Nombre accion
                                    </label>
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        setnombreAccion(e.target.value)
                                      }
                                      value={nombreAccion}
                                      id="nombreAccion"
                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                      required
                                    />
                                  </div>
                                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label
                                      htmlFor="text"
                                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Descripción accion
                                    </label>
                                    <input
                                      type="text"
                                      name="descripcionAccion"
                                      onChange={(e) =>
                                        setDescripcionAccion(e.target.value)
                                      }
                                      value={descripcionAccion}
                                      id="descripcionAccion"
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
                                        setpuntosAccion(e.target.value)
                                      }
                                      value={puntosAccion}
                                      id="puntosAccion"
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
                                  onClick={() => OpenDeleteAccionModal(accion)}
                                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                >
                                  <FaRegTrashAlt />
                                </button>
                              </Tooltip>

                              <Modal
                                nombre="Eliminar Accion"
                                isOpen={openModalDeleteAccion}
                                onClose={ClosedDeleteAccionModal}
                                size="auto"
                              >
                                {SelectDeleteAccion && (
                                  <div className="mt-4">
                                    <p>
                                      ¿Estás seguro de que deseas eliminar esta
                                      accion llamada{" "}
                                      <span className="font-semibold">
                                        {SelectDeleteAccion.nombre}
                                      </span>{" "}
                                      y total de puntos{" "}
                                      <span className="font-semibold">
                                        {SelectDeleteAccion.puntos}
                                      </span>
                                      ?
                                    </p>
                                    <div className="flex justify-end gap-2 mt-4">
                                      <button
                                        onClick={handleDeleteAccion}
                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                      >
                                        Eliminar
                                      </button>
                                      <button
                                        onClick={ClosedDeleteAccionModal}
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
              Fondo="none"
            >
              {dataAcciones.length >= 10 ? (
                <p className="text-red-500 text-sm">
                  No puedes agregar más Acciones, para agregar una nueva accion
                  por favor elimina una de los anteriores configuradas.
                </p>
              ) : (
                <form
                  className="space-y-6 my-5 px-2"
                  onSubmit={handleSubmitActions}
                >
                  <div>
                    <label
                      htmlFor="nombreAccion"
                      className="block text-sm font-semibold text-gray-800 dark:text-white mb-2"
                    >
                      Nombre de la Acción
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setNewNombreAccion(e.target.value)}
                      value={newNombreAccion}
                      id="newNombreAccion"
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
                      onChange={(e) => setNewDescripcionAccion(e.target.value)}
                      value={newDescripcionAccion}
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
                      onChange={(e) => setNewPuntosAccion(e.target.value)}
                      value={newPuntosAccion}
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
              )}
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
            Fondo="none"
          >
            {DataPremios.length > 5 ? (
              <p className="text-red-500 text-sm">
                No puedes agregar más premios, para agregar uno nuevo por favor
                elimina uno de los anteriores configurados.
              </p>
            ) : (
              <form
                className="space-y-6 my-8 px-6"
                onSubmit={handleSubmitPremioEspecifico}
              >
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
                    onChange={(e) =>
                      setNewdescripcionPremioEspe(e.target.value)
                    }
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
            )}
          </Modal>

          <Modal
            nombre="Premios"
            isOpen={openViewPremios}
            onClose={ClosedModalViewPremios}
            size="fixed"
            Fondo="none"
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

                <div className="flex flex-col justify-center items-center bg-slate-100 rounded-full p-2">
                  <div>Premio Global</div>
                  <div className="flex gap-2 justify-center items-center">
                    {PremioGlobal && <p>{PremioGlobal.nombre}</p>}
                    {PremioGlobal && <p>{PremioGlobal.costoPuntos}</p>}
                  </div>
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
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CurrentPremio.length === 0 ? (
                    <p className="text-center text-xs mx-10   flex justify-center items-center mt-10 mb-10">
                      No hay productos disponibles
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
                          {premio.tipo === "global" ? <FaCrown /> : null}{" "}
                          {premio.costoPuntos}
                        </td>
                        <td className="px-3 py-4 flex gap-2">
                          {premio.tipo === "global" ? (
                            <Tooltip content="Editar">
                              <button
                                type="button"
                                onClick={() => openModalEditPremios(premio)}
                                className="text-white bg-red-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                              >
                                <FaRegEdit />
                              </button>
                            </Tooltip>
                          ) : (
                            <Tooltip content="Editar">
                              <button
                                type="button"
                                onClick={() => openModalEditPremios(premio)}
                                className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                              >
                                <FaRegEdit />
                              </button>
                            </Tooltip>
                          )}

                          <Modal
                            nombre={"Actualizar Premios"}
                            isOpen={PremioEdit}
                            onClose={ClosedModalEditPremios}
                            size="auto"
                            Fondo="auto"
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
                            {premio.tipo === "global" ? (
                              <button
                                onClick={handleEditPremioGlobal}
                                className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                Actualizar global
                              </button>
                            ) : (
                              <button
                                onClick={handleEditPremio}
                                className="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                Actualizar Premio especifico
                              </button>
                            )}
                          </Modal>

                          <Tooltip content="Eliminar">
                            <button
                              type="button"
                              onClick={() => openModalPremio(premio)}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                              <FaRegTrashAlt />
                            </button>
                          </Tooltip>

                          <Modal
                            isOpen={openModalDeletePremio}
                            onClose={ClosedModalPremio}
                            Fondo="auto"
                            size="auto"
                          >
                            {selectPremioDelete && (
                              <div className="mt-4">
                                <p>
                                  ¿Estás seguro de que deseas eliminar este
                                  premio llamado{" "}
                                  <span className="font-semibold">
                                    {selectPremioDelete.nombre}
                                  </span>{" "}
                                  y su total de puntos{" "}
                                  <span className="font-semibold">
                                    {selectPremioDelete.costoPuntos}
                                  </span>
                                  ?
                                </p>
                                <div className="flex justify-end gap-2 mt-4">
                                  {premio.tipo === "global" ? (
                                    <button
                                      onClick={handleDeletePremio}
                                      className="text-white bg-yellow-300 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    >
                                      Eliminar
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleDeletePremio}
                                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    >
                                      Eliminar
                                    </button>
                                  )}

                                  <button
                                    onClick={ClosedModalPremio}
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
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
            >
              Premios Especificos
            </span>

            <div className="py-2">
              <span
                onClick={openModalpremiosGlobal}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
              >
                Premio Global
              </span>
            </div>
          </div>
        )}
        <Modal
          // acciononClick={openModalViewPremios}
          nombre={"Configurar Premio Global"}
          isOpen={openModalPremioGlobal}
          onClose={ClosedModalpremiosGlobal}
          size="auto"
          Fondo="none"
        >
          {PremioGlobal ? (
            <p className="text-red-500 text-sm">
              No puede agregar más premios globales.
            </p>
          ) : (
            <form
              className="space-y-4 my-10"
              onSubmit={handleSubmitPremioGlobal}
            >
              <div className="md:w-full px-3 mb-6 md:mb-0">
                <label
                  htmlFor="NewnombrePremioGlobal"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre Premio
                </label>
                <input
                  type="text"
                  onChange={(e) => setNewnombrePremioGlobal(e.target.value)}
                  value={NewnombrePremioGlobal}
                  id="NewnombrePremioGlobal"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div className="md:w-full px-3 mb-6 md:mb-0">
                <label
                  htmlFor="NewdescripcionPremioGlobal"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Descripción del premio
                </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setNewdescripcionPremioGlobal(e.target.value)
                  }
                  value={NewdescripcionPremioGlobal}
                  id="NewdescripcionPremioGlobal"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div className="md:w-full px-3 mb-6 md:mb-0">
                <label
                  htmlFor="NewpuntosPremioGlobal"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Cantidad de puntos
                </label>
                <input
                  type="number"
                  onChange={(e) => setNewPuntosPremioGlobal(e.target.value)}
                  value={NewpuntosPremioGlobal}
                  id="NewpuntosPremioGlobal"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Configurar Premio Global
              </button>
            </form>
          )}
        </Modal>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id Cliente
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
                hidden={userPaquete === "JeicyEspecial" ? true : false}
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
                <td className=" py-4 font-semibold text-gray-900 dark:text-white">
                  <p className="bg-red-100 text-red-800 text-base font-medium text-center  rounded dark:bg-red-900 dark:text-red-300">
                    {cliente.estado}
                  </p>
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
          Fondo="none"
        >
          {selectCliente && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start p-6">
              <div className="flex justify-center flex-col">
                {selectCliente.contentType &&
                selectCliente.contentType.includes("image") ? (
                  <img
                    className="h-96 w-86"
                    src={`${selectCliente.recibo}`}
                    alt="Recibo"
                  />
                ) : selectCliente.contentType &&
                  selectCliente.contentType.includes("video") ? (
                  <video className="h-96 w-full" controls>
                    <source
                      src={`${selectCliente.recibo}`}
                      type={selectCliente.contentType}
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>Formato de archivo no soportado</p>
                )}
              </div>
              <div className="flex flex-col gap-6 bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">
                    Nombre Cliente:
                  </p>
                  <p className="text-lg text-gray-800">
                    {selectCliente.nombre}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">
                    Número WhatsApp:
                  </p>
                  <p className="text-lg text-gray-800">
                    {selectCliente.numerowp}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">
                    Descripción:
                  </p>
                  <p className="text-lg text-gray-800">
                    {selectCliente.descripcion}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-700">
                    Seleccionar Acción:
                  </p>
                  <div className="relative">
                    <select
                      className="border rounded p-2 text-gray-800 w-full"
                      value={selectedAction}
                      onChange={handleSelectChange}
                    >
                      <option value="">Seleccione una acción</option>
                      {dataAcciones.map((accion) => (
                        <option key={accion.id} value={accion.puntos}>
                          {accion.nombre} - {accion.puntos}
                        </option>
                      ))}
                    </select>

                    {selectedAction && (
                      <button
                        className="absolute right-6 top-2 bg-red-500 text-white text-2xl  rounded-full"
                        onClick={handleClearSelection}
                      >
                        <MdCancel />
                      </button>
                    )}
                  </div>
                  {selectedAction === "" && (
                    <p className="text-sm text-red-600 mt-1">
                      Debe seleccionar una acción para continuar.
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  className="border rounded p-2 text-gray-900"
                  // hidden={selectedAction === "" ? false : true}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Indique un comentario sobre el porqué aprueba o declina la solicitud"
                ></input>
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() =>
                      HandleAprovedCliente(
                        selectCliente,
                        "Aceptado",
                        comentario
                      )
                    }
                    className={`p-2 rounded w-full text-white ${
                      selectedAction
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!selectedAction}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() =>
                      HandleAprovedCliente(
                        selectCliente,
                        "Rechazado",
                        comentario
                      )
                    }
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
