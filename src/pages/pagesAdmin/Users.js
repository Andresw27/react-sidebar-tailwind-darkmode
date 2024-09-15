import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Select, Tooltip } from "@material-tailwind/react";
import { MdDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase-config";
import { db } from "../../firebase-config";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { useSelector } from "react-redux";

const LoadingSplash = () => {
  return (
    <div style={splashStyle}>
      <p className="text-2xl">Registrando Usuario...</p>
    </div>
  );
};

const splashStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo semi-transparente
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000, // Asegura que esté por encima de otros elementos
};

function Users() {
  const { identificador } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [valorProducto, setValorProducto] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de la alerta
  const [isModalOpenn, setIsModalOpenn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [UserEdit, setUserEdit] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Estado para el producto seleccionado
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcionEmpresa, setDescripcionEmpresa] = useState("");
  const [Logo, setLogo] = useState("");
  const [Categoria, setCategoria] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nit, setNit] = useState("");
  const [direccion, setDireccion] = useState("");
  const [IdBot, setIdBot] = useState("");
  const [naceptado, setNaceptado] = useState("");
  const [ndistribucion, setNdistribucion] = useState("");
  const [nentregado, setNentregado] = useState("");
  const [ncancelado, setNcancelado] = useState("");
  const [npremioentregado, setNpremioentregado] = useState("");
  const [nsolicitudRechazada, setNsolicitudRechazada] = useState("");
  const [tipoPaquete, setTipoPaquete] = useState("");
  const [linkwp1, setlinkwp1] = useState("");
  const [linkwp2, setlinkwp2] = useState("");
  const [linkwp3, setlinkwp3] = useState("");
  const [Rinstagram, setRinstagram] = useState("");
  const [Rfacebook, setRfacebook] = useState("");
  const [Rtiktok, setRtiktok] = useState("");
  const [ubicacion, setubicacion] = useState("");
  const [webhook, setwebhook] = useState("");
  const [dataCategorias, setdataCategorias] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [selectidentificadordelete, setselectidentificadordelete] =
    useState("");

  const handleopenmodaldeleteuser = (user) => {
    setIsModalOpenn(true);
    setSelectedProduct(user);
    setselectidentificadordelete(user.identificador);
    console.log(user);
  };

  const handleclosemodaldeleteuser = () => {
    setIsModalOpenn(false);
  };

  const handlePaqueteChange = (event) => {
    setTipoPaquete(event.target.value);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //funcion open y closed modal delete
  // const openModall = (product) => {
  //   setSelectedProduct(product);
  //   setIsModalOpenn(true);
  // };

  // const closeModall = () => {
  //   setIsModalOpenn(false);
  //   setSelectedProduct(null);
  // };
  //filtrar user por pagina
  const filterDataUsers = dataUsers.filter(
    (users) =>
      (users.nombreUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (users.nombreEmpresa?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (users.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (users.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (users.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (users.nit?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const CurrentUsers = filterDataUsers.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openEditModal = (user) => {
    setUserEdit(user);
    setEmail(user.correo);
    setPassword(user.password);
    setNombreEmpresa(user.nombreEmpresa);
    setNombre(user.nombre);
    setDescripcionEmpresa(user.descripcion);
    setCategoria(user.categoria);
    setTelefono(user.telefono);
    setNit(user.nit);
    setDireccion(user.direccion);
    setIdBot(user.idBot);
    setTipoPaquete(user.paquete);
    setNaceptado(user.naceptado);
    setNdistribucion(user.ndistribucion);
    setNcancelado(user.ncancelado);
    setNpremioentregado(user.npremioentregado);
    setNentregado(user.nentregado);
    setNsolicitudRechazada(user.nrechazado);
    setlinkwp1(user.linkwp1);
    setlinkwp2(user.linkwp2);
    setlinkwp3(user.linkwp3);
    setRinstagram(user.Rinstagram);
    setRtiktok(user.Rtiktok);
    setRfacebook(user.Rfacebook);
    setubicacion(user.ubicacion);
    setwebhook(user.webhook);
    setLogo(user.logo);
    setEditModalOpen(true);
    console.log("usuario editsss", user.descripcion);
  };

  const closeEditModal = () => {
    setUserEdit(null);
    setEmail("");
    setPassword("");
    setNombreEmpresa("");
    setNombre("");
    setTelefono("");
    setNit("");
    setDireccion("");
    setIdBot("");
    setNaceptado("");
    setNdistribucion("");
    setNentregado("");
    setEditModalOpen(false);
  };
  //editar user
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!UserEdit || !UserEdit.identificador) {
      console.error("No user to edit or user ID is undefined");
      return;
    }

    const updatedUser = {
      ...UserEdit,
      nombre: nombre,
      nombreEmpresa: nombreEmpresa,
      descripcion: descripcionEmpresa,
      categoria: Categoria,
      paquete: tipoPaquete,
      correo: Email,
      password: password,
      telefono: telefono,
      nit: nit,
      idBot: IdBot,
      direccion: direccion,
      naceptado: naceptado,
      ndistribucion: ndistribucion,
      nentregado: nentregado,
      nrechazado: nsolicitudRechazada,
      linkwp1: linkwp1,
      linkwp2: linkwp2,
      linkwp3: linkwp3,
      Rinstagram: Rinstagram,
      Rtiktok: Rtiktok,
      Rfacebook: Rfacebook,
      ubicacion: ubicacion,
      webhook: webhook,
    };

    console.log("Updated product payload:", JSON.stringify(updatedUser));

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/usuarios/actualizar/${UserEdit.identificador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to updatssse product: ${response.status}`);
      }
      setAlertMessage("Usuario actualizado con éxito");
      setShowAlert(true);
      closeEditModal();
      fetchUser();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteUserByIdentificador = async () => {
    try {
      if (!selectidentificadordelete) {
        console.error("Identificador no disponible");
        return;
      }

      // Obtener el documento del usuario por identificador
      const userQuery = query(
        collection(db, "usuarios"),
        where("identificador", "==", selectidentificadordelete) // Aquí usamos el identificador guardado
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

      const storage = getStorage();
      const logoRef = ref(storage, `profileImages/${selectedProduct}`); // Construimos la referencia usando el identificador

      await deleteObject(logoRef)
        .then(() => {
          console.log("Logo eliminado correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar el logo:", error.message);
        });

      // Función para eliminar todos los documentos de una subcolección
      const deleteSubcollectionDocuments = async (subcollectionRef) => {
        const snapshot = await getDocs(subcollectionRef);
        const batch = writeBatch(db);

        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
      };

      // Eliminar documentos de la subcolección 'productos'
      const productosRef = collection(db, "productos", uidUser, "productos");
      await deleteSubcollectionDocuments(productosRef);

      // Finalmente, eliminar el documento principal del usuario
      await deleteDoc(doc(db, "usuarios", uidUser));

      console.log(
        "Usuario y sus documentos asociados eliminados correctamente"
      );
    } catch (error) {
      console.error(
        "Error al eliminar el usuario y sus documentos:",
        error.message
      );
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(
        "https://us-central1-jeicydelivery.cloudfunctions.net/app/usuarios"
      );
      const data = await response.json();
      setDataUsers(data.usuarios);
      console.log("la data es", data.usuarios);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  //generar identificador unico aleatoriamente
  const getRandomIdentifier = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 5;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  };
  //crear usuario

  async function createUser(
    email,
    password,
    nombreEmpresa,
    nombre,
    telefono,
    nit,
    IdBot,
    direccion,
    naceptado,
    ndistribucion,
    nentregado,
    ncancelado,
    nrechazado,
    npremioentregado,
    linkwp1,
    linkwp2,
    linkwp3,
    categoria,
    logo, // El archivo del logo subido
    descripcion,
    Rtiktok,
    Rinstagram,
    Rfacebook,
    ubicacion,
    webhook
  ) {
    try {
      setLoading(true); // Activamos el estado de carga al comenzar el proceso
      const adminUser = auth.currentUser; // Guardamos la sesión del admin

      // Crear nuevo usuario en Firebase Authentication
      const infouser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Subir el logo a Firebase Storage
      const storage = getStorage();
      let logoUrl = "";
      const user = auth.currentUser;
      if (logo) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, logo);
        logoUrl = await getDownloadURL(storageRef);
      }

      // Guardar la información del usuario en Firestore
      const docuRef = doc(db, `usuarios/${infouser.user.uid}`);
      await setDoc(docuRef, {
        correo: email,
        password: password,
        nombreEmpresa: nombreEmpresa,
        nombre: nombre,
        telefono: telefono,
        nit: nit,
        idBot: IdBot,
        direccion: direccion,
        naceptado: naceptado,
        ndistribucion: ndistribucion,
        nentregado: nentregado,
        ncancelado: ncancelado,
        identificador: getRandomIdentifier(),
        role: "Usuario",
        nrechazado: nrechazado,
        npremioentregado: npremioentregado,
        linkwp1: linkwp1,
        linkwp2: linkwp2,
        linkwp3: linkwp3,
        categoria: categoria,
        paquete: tipoPaquete,
        logo: logoUrl,
        descripcion: descripcion,
        calificacion: null,
        Rtiktok: Rtiktok,
        Rinstagram: Rinstagram,
        Rfacebook: Rfacebook,
        ubicacion: ubicacion,
        webhook: webhook,
      });

      // Restaurar la sesión del administrador
      await auth.updateCurrentUser(adminUser);

      console.log("Usuario creado exitosamente con logo!");
      setAlertMessage("Usuario añadido con éxito");
      setShowAlert(true);
      closeModal(); // Cerrar modal o formulario
      fetchUser(); // Refrescar lista de usuarios si es necesario
    } catch (error) {
      console.error("Error creando el usuario:", error);
    } finally {
      setLoading(false); // Desactivamos el estado de carga al terminar
    }
  }

  function submitHandler(e) {
    e.preventDefault();

    const nombre = e.target.elements.nombreUsuario.value;
    const nombreEmpresa = e.target.elements.nombreEmpresa.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const telefono = e.target.elements.telefono.value;
    const nit = e.target.elements.Nit.value;
    const idBot = e.target.elements.IdBot.value;
    const direccion = e.target.elements.direccion.value;
    const naceptado = e.target.elements.Naceptado.value;
    const nrechazado = e.target.elements.Nrechazado.value;
    const ndistribucion = e.target.elements.Ndistribucion.value;
    const nentregado = e.target.elements.Nentregado.value;
    const ncancelado = e.target.elements.Ncancelado.value;
    const npremioentregado = e.target.elements.Npremioentregado.value;
    const linkwp1 = e.target.elements.linkwp1.value;
    const linkwp2 = e.target.elements.linkwp2.value;
    const linkwp3 = e.target.elements.linkwp3.value;
    const categoria = e.target.elements.categorias.value;
    const logoFile = e.target.elements.logoEmpresa.files[0]; // El archivo del logo
    const descripcion = e.target.elements.descripcionEmpresa.value;
    const Rtiktok = e.target.elements.Rtiktok.value;
    const Rinstagram = e.target.elements.Rinstagram.value;
    const Rfacebook = e.target.elements.Rfacebook.value;
    const ubicacion = e.target.elements.ubicacion.value;
    const webhook = e.target.elements.Webhook.value;

    // Llama a la función para crear el usuario
    createUser(
      email,
      password,
      nombreEmpresa,
      nombre,
      telefono,
      nit,
      idBot,
      direccion,
      naceptado,
      ndistribucion,
      nentregado,
      nrechazado,
      ncancelado,
      npremioentregado,
      linkwp1,
      linkwp2,
      linkwp3,
      categoria,
      logoFile, // Pasa el archivo del logo a la función
      descripcion,
      Rtiktok,
      Rinstagram,
      Rfacebook,
      ubicacion,
      webhook
    );
  }

  const fetchCategorias = async () => {
    try {
      const categoriasRef = collection(db, "categorias");

      const unsubscribe = onSnapshot(categoriasRef, (snapshot) => {
        const categorias = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setdataCategorias(categorias);
        console.log("Categorías:", categorias);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      {loading && <LoadingSplash />}

      <div className="my-3 mx-10 flex justify-between">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Usuarios
        </p>
      </div>
      <div className="col-span-2 relative overflow-x-auto shadow-md mx-4 sm:rounded-lg">
        <div className="flex justify-between items-center p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="Buscar Usuario..."
          />
          <button
            onClick={openModal}
            data-modal-target="authentication-modal"
            data-modal-toggle="authentication-modal"
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Añadir Usuario
          </button>
          <Modal
            isOpen={isModalOpen}
            nombre="Añadir Nuevo Usuario"
            onClose={closeModal}
            size="fixed"
          >
            <div>
              <form className="space-y-4" onSubmit={submitHandler}>
                <div className="p-4 ">
                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Nombre Usuario
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                        id="nombreUsuario"
                        type="text"
                        required
                      />
                    </div>
                    <div className="md:w-1/2 px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-last-name"
                      >
                        Nombre Empresa
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="nombreEmpresa"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-last-name"
                      >
                        Descripción Empresa
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="descripcionEmpresa"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-last-name"
                      >
                        Logo Empresa
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="logoEmpresa"
                        type="file"
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-last-name"
                      >
                        Categoria
                      </label>
                      <select
                        className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        defaultValue=""
                        required
                        id="categorias"
                      >
                        <option value="" hidden>
                          Elige una categoria
                        </option>
                        {dataCategorias.map((categoria, index) => (
                          <option key={index} value={categoria.nombre}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Telefono
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="telefono"
                        type="number"
                        required
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Correo Electronico
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="email"
                        type="text"
                        required
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Nit
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="Nit"
                        type="number"
                        required
                      />
                    </div>
                  </div>
                  <div className="-mx-3 md:flex mb-2">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Direccion
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="direccion"
                        type="text"
                        required
                      />
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Id Bot
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="IdBot"
                        type="text"
                      />
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Tipo Paquete
                      </label>
                      <select
                        className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        defaultValue=""
                        required
                        id="TipoPaquete"
                        onChange={handlePaqueteChange}
                      >
                        <option value="" hidden>
                          Elige Una Opción
                        </option>
                        <option value="JeicyPedidos">Jeicy Pedidos</option>
                        <option value="JeicyPuntos">Jeicy Puntos</option>
                        <option value="JeicyFull">Jeicy Full</option>
                        <option value="JeicyEspecial">Jeicy Especial</option>
                      </select>
                    </div>
                  </div>

                  <div className="-mx-3 md:flex mb-2">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        N Pedido Aceptado o N Solicitud Aceptada
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Naceptado"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        N Pedido Distribución
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Ndistribucion"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        N Pedido Entregado
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Nentregado"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="-mx-3 md:flex mb-2">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        N Pedido Cancelado
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Ncancelado"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        N Solicitud Rechazada
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Nrechazado"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        N Premio Entregado
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Npremioentregado"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Link Wp 1
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="linkwp1"
                        type="text"
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Link Wp 2
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="linkwp2"
                        type="text"
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Link Wp 3
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="linkwp3"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                        Link Instagram
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="Rinstagram"
                        type="text"
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                        Link Facebook
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="Rfacebook"
                        type="text"
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                        Link tiktok
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="Rtiktok"
                        type="text"
                      />
                    </div>
                    <div className="md:w-full px-3">
                      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                        Link Ubicación
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="ubicacion"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="-mx-3 md:flex mb-2">
                    <div className="md:w-full px-3">
                      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                        Webhook
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="Webhook"
                        type="text"
                      />
                    </div>
                    <div className="md:w-full px-">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-zip"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                        />
                        <span
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Añadir Usuario
                </button>
              </form>
            </div>
          </Modal>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                identificador
              </th>
              <th scope="col" hidden className="px-6 py-3">
                ID Bots
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre Empresa
              </th>
              <th scope="col" className="px-6 py-3">
                Telefono
              </th>
              <th scope="col" className="px-6 py-3">
                Correo Electronico
              </th>
              <th scope="col" hidden className="px-6 py-3">
                Notificacion Aceptado
              </th>
              <th scope="col" hidden className="px-6 py-3">
                Notificacion Distribucion
              </th>
              <th scope="col" hidden className="px-6 py-3">
                Notificacion Entragado
              </th>

              <th scope="col" className="px-6 py-3">
                NIT
              </th>
              <th scope="col" className="px-6 py-3">
                Dirección
              </th>
              <th scope="col" className="px-6 py-3">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {CurrentUsers.map((user, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                  {user.identificador}
                </td>

                <td className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white">
                  {user.nombre}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {user.nombreEmpresa}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                  {user.telefono}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                  {user.correo}
                </td>
                <td
                  hidden
                  className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white"
                >
                  {user.naceptado}
                </td>
                <td
                  hidden
                  className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white"
                >
                  {user.ndistribucion}
                </td>
                <td
                  hidden
                  className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white"
                >
                  {user.nentregado}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                  {user.nit}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white">
                  {user.direccion}
                </td>

                <td className="px-3 py-4 flex gap-2">
                  <Tooltip content="Editar">
                    <button
                      type="button"
                      onClick={() => openEditModal(user)}
                      className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                    >
                      <FaRegEdit />
                    </button>
                  </Tooltip>
                  <Tooltip content="Eliminar">
                    <button
                      type="button"
                      onClick={() => handleopenmodaldeleteuser(user)}
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          className="h-auto"
          isOpen={editModalOpen}
          nombre="Editar Usuario"
          onClose={closeEditModal}
          size="fixed"
        >
          <div>
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div className="p-4 ">
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Nombre Usuario
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                      id="nombreUsuario"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Nombre Empresa
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      id="nombreEmpresa"
                      type="text"
                      value={nombreEmpresa}
                      onChange={(e) => setNombreEmpresa(e.target.value)}
                    />
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Descripción Empresa
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      id="descripcionEmpresa"
                      value={descripcionEmpresa}
                      onChange={(e) => setDescripcionEmpresa(e.target.value)}
                      type="text"
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Logo Empresa
                    </label>
                    <div className="flex">
                      <img src={Logo} className="h-16"></img>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="logoEmpresa"
                        type="file"
                        onChange={(e) => setLogo(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Categoria
                    </label>
                    <select
                      className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      id="Categoria"
                      value={Categoria || ""}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      {/* Opción por defecto si no hay categoría definida */}
                      <option value="" disabled>
                        {Categoria
                          ? "Selecciona una categoría"
                          : "Sin categoría definida"}
                      </option>

                      {/* Mapeo de categorías disponibles */}
                      {dataCategorias.map((categoria, index) => (
                        <option key={index} value={categoria.nombre}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Telefono
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="telefono"
                      type="number"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Correo Electronico
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="email"
                      type="text"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Nit
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="Nit"
                      type="number"
                      value={nit}
                      onChange={(e) => setNit(e.target.value)}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Direccion
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="direccion"
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Id Bot
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="IdBot"
                      type="text"
                      value={IdBot}
                      onChange={(e) => setIdBot(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Tipo Paquete
                    </label>
                    <select
                      className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      defaultValue=""
                      required
                      id="TipoPaquete"
                      value={tipoPaquete}
                      onChange={(e) => setTipoPaquete(e.target.value)}
                    >
                      <option value="" hidden>
                        Elige Una Opción
                      </option>
                      <option value="JeicyPedidos">Jeicy Pedidos</option>
                      <option value="JeicyPuntos">Jeicy Puntos</option>
                      <option value="JeicyFull">Jeicy Full</option>
                      <option value="JeicyEspecial">Jeicy Especial</option>
                    </select>
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      N Pedido Aceptado o N Solicitud Aceptada
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Naceptado"
                        value={naceptado}
                        onChange={(e) => setNaceptado(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      N Pedido Distribución
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Ndistribucion"
                        value={ndistribucion}
                        onChange={(e) => setNdistribucion(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      N Pedido Entregado
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Nentregado"
                        value={nentregado}
                        onChange={(e) => setNentregado(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      N Pedido Cancelado
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        type="text"
                        value={ncancelado}
                        onChange={(e) => setNcancelado(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      N Solicitud Rechazada
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Nrechazado"
                        type="text"
                        value={nsolicitudRechazada}
                        onChange={(e) => setNsolicitudRechazada(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      N Premio Entregado
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Npremioentregado"
                        type="text"
                        value={npremioentregado}
                        onChange={(e) => setNpremioentregado(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Link Wp 1
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="linkwp1"
                      type="text"
                      value={linkwp1}
                      onChange={(e) => setlinkwp1(e.target.value)}
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Link Wp 2
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="linkwp2"
                      type="text"
                      value={linkwp2}
                      onChange={(e) => setlinkwp2(e.target.value)}
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Link Wp 3
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="linkwp3"
                      type="text"
                      value={linkwp3}
                      onChange={(e) => setlinkwp3(e.target.value)}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                      Link Instagram
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="Rinstagram"
                      type="text"
                      value={Rinstagram}
                      onChange={(e) => setRinstagram(e.target.value)}
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                      Link Facebook
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="Rfacebook"
                      type="text"
                      value={Rfacebook}
                      onChange={(e) => setRfacebook(e.target.value)}
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                      Link tiktok
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="Rtiktok"
                      type="text"
                      value={Rtiktok}
                      onChange={(e) => setRtiktok(e.target.value)}
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                      Link Ubicación
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="ubicacion"
                      type="text"
                      value={ubicacion}
                      onChange={(e) => setubicacion(e.target.value)}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                      WEBHOOK
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="webhook"
                      type="text"
                      value={webhook}
                      onChange={(e) => setwebhook(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/2 px-">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-zip"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEye : faEyeSlash}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Actualizar Usuario
              </button>
            </form>
          </div>
        </Modal>
        <Modal
          isOpen={isModalOpenn}
          nombre="Eliminar Usuario"
          onClose={handleclosemodaldeleteuser}
          size="auto"
        >
          {selectedProduct && (
            <div className="mt-4 justify-center flex flex-col items-center">
              <img className="h-40 w-40" src={selectedProduct.logo}></img>
              <p>
                ¿Estás seguro de que deseas eliminar el usuario{" "}
                <span className="font-semibold">
                  {selectedProduct.nombreEmpresa}
                </span>
                <span className="font-semibold"></span>?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={deleteUserByIdentificador}
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Eliminar
                </button>
                <button
                  onClick={handleclosemodaldeleteuser}
                  className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                >
                  Cancelar
                </button>
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
            filterDataUsers.length / rowsPerPage
          )}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filterDataUsers.length / rowsPerPage)
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

export default Users;
