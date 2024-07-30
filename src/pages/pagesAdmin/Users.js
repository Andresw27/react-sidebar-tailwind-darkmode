import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebase-config";
import { db } from "../../firebase-config";
function Users() {
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
  const [telefono, setTelefono] = useState("");
  const [nit, setNit] = useState("");
  const [direccion, setDireccion] = useState("");
  const [IdBot, setIdBot] = useState("");
  const [naceptado, setNaceptado] = useState("");
  const [ndistribucion, setNdistribucion] = useState("");
  const [nentregado, setNentregado] = useState("");

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
    setTelefono(user.telefono);
    setNit(user.nit);
    setDireccion(user.direccion);
    setIdBot(user.idBot);
    setNaceptado(user.naceptado);
    setNdistribucion(user.ndistribucion);
    setNentregado(user.nentregado);
    setEditModalOpen(true);
    console.log('usuario edit',user)

  };
  console.log('d',UserEdit)

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

    if (!UserEdit) {
      console.error("No user to edit or user ID is undefined");
      return;
    }

    const updatedUser = {
      ...UserEdit,
      nombre: nombre,
      nombreEmpresa: nombreEmpresa,
      correo:Email,
      password:password,
      telefono:telefono,
      nit:nit,
      idBot:IdBot,
      direccion:direccion,
      naceptado:naceptado,
      ndistribucion:ndistribucion,
      identificador:getRandomIdentifier(),
      nentregado:nentregado,
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

      const result = await response.json();
      console.log("Product updated successfully:", result);
      setAlertMessage("Usuario actualizado con éxito");
      setShowAlert(true);
      closeEditModal();
      fetchUser();
    } catch (error) {
      console.error("Error updating product:", error);
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
    nentregado

  ) {
    try {
      const infouser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const docuRef = doc(db, `usuarios/${infouser.user.uid}`);
      await setDoc(docuRef, {
        correo: email,
        password: password,
        nombreEmpresa: nombreEmpresa,
        nombre: nombre,
        telefono: telefono,
        nit: nit,
        idBot:IdBot,
        direccion: direccion,
        naceptado: naceptado,
        ndistribucion: ndistribucion,
        nentregado: nentregado,
        identificador: getRandomIdentifier(),
        role:"Usuario"
      });
      console.log("User created successfully!");
      setAlertMessage("Usuario Añadido Con exito");
      setShowAlert(true);
      closeModal();
      fetchUser();
    } catch (error) {
      console.error("Error creating user:", error);
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
    const ndistribucion = e.target.elements.Ndistribucion.value;
    const nentregado = e.target.elements.Nentregado.value;
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
      nentregado
    );
    console.log(
      "data",
      email,
      password,
      nombreEmpresa,
      nit,
      direccion,
      idBot,
      nombre,
      telefono,
      naceptado,
      ndistribucion,
      nentregado
    );
  }

  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}

      <div className="my-3 mx-10">
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
            className="h-auto"
            isOpen={isModalOpen}
            nombre="Añadir Nuevo Usuario"
            onClose={closeModal}
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
                        htmlFor="grid-password"
                      >
                        Telefono
                      </label>
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                        id="telefono"
                        type="number"
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
                  </div>
                 
                  <div className="-mx-3 md:flex mb-2">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        Notificacion Aceptado
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Naceptado"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        Notificacion Distribución
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Ndistribucion"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-city"
                      >
                        Notificacion Entregado
                      </label>
                      <div className="relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                          id="Nentregado"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 px-3">
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
              <th scope="col" hidden className="px-6 py-3">
                ID User
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
                <td
                  hidden
                  className="px-6 text-xs py-4 font-semibold text-gray-900 dark:text-white"
                >
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
                      // onClick={() => openModall(product)}
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
                      htmlFor="grid-password"
                    >
                      Telefono
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      type="number"
                    />
                  </div>
                  <div className="md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Correo
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                      id="email"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="text"
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
                      value={nit}
                      onChange={(e) => setNit(e.target.value)}
                      type="number"
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
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    ID Bot
                  </label>
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                    id="idBot"
                    value={IdBot}
                    onChange={(e) => setIdBot(e.target.value)}
                    type="text"
                  />
                </div>

                </div>
              
                <div className="-mx-3 md:flex mb-2">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Notificacion Aceptado
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Naceptado"
                        value={naceptado}
                        onChange={(e) => setNaceptado(e.target.value)}
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Notificacion Distribución
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Ndistribucion"
                        value={ndistribucion}
                        onChange={(e) => setNdistribucion(e.target.value)}
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Notificacion Entregado
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        id="Nentregado"
                        value={nentregado}
                        onChange={(e) => setNentregado(e.target.value)}
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3">
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
              Actualizar Usuario
              </button>
            </form>
          </div>
        </Modal>
        {/* <Modal
          isOpen={isModalOpenn}
          nombre="Eliminar Producto"
          onClose={closeModall}
        >
          {selectedProduct && (
            <div className="mt-4">
              <p>
                ¿Estás seguro de que deseas eliminar el producto{" "}
                <span className="font-semibold">{selectedProduct.nombre}</span>{" "}
                con un valor de{" "}
                <span className="font-semibold">
                  {`${Number(selectedProduct.valor).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}`}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  // onClick={handleDelete}
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Eliminar
                </button>
                <button
                  onClick={closeModall}
                  className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </Modal> */}
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
