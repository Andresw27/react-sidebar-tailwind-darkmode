import React, { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { MenuItem, Tooltip } from "@material-tailwind/react";
import Alert from "../components/Alert"; // Importa el componente de alerta
import { IoSearch, IoClose } from "react-icons/io5";
import { db } from "../firebase-config";

import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { UserContext } from "../UserContext"; // Asegúrate de ajustar la ruta correcta
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Productos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(4);
  const [dataProductos, setDataProductos] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [valorProducto, setValorProducto] = useState("");
  const [descripcionProducto, setdescripcionProducto] = useState("");
  const [menu, setMenu] = useState("");
  const [categoriaMenu, setcategoriaMenu] = useState("");
  const [calificacionProducto, setcalificacionProducto] = useState("");
  const [estadoProducto, setestadoProducto] = useState("");
  const [logoProducto, setlogoProducto] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isModalOpenn, setIsModalOpenn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [DataMenus, setDataMenus] = useState([]);
  const [DataCategorias, setDataCategorias] = useState([]);
  const { identificador, nombreEmpresa } = useSelector((state) => state.user);
  console.log(identificador, nombreEmpresa);

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  //funciones de cambios en los inputs
  const handlemenu = (event) => {
    setMenu(event.target.value);
    console.log(menu);
  };
  const handlemenuCategory = (event) => {
    setcategoriaMenu(event.target.value);
    console.log(event);
  };
  const handlecalificacionProducto = (event) => {
    setcalificacionProducto(event.target.value);
    console.log(calificacionProducto);
  };
  const handleEstadoProdcuto = (event) => {
    setestadoProducto(event.target.value);
    console.log(estadoProducto);
  };

  const handleImageChange = (e) => {
    setlogoProducto(e.target.files[0]); // Almacena el archivo
  };

  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openModall = (product) => {
    setSelectedProduct(product);
    setIsModalOpenn(true);
  };

  const closeModall = () => {
    setIsModalOpenn(false);
    setSelectedProduct(null);
  };

  const filteredProducts = dataProductos.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.valor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //  // Firestore-based fetchProductos function
  const fetchProductos = async () => {
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

      const userDocRef = collection(db, "productos", uidUser, "productos");

      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const productos = [];
        snapshot.forEach((doc) => {
          productos.unshift({ id: doc.id, ...doc.data() });
        });

        setDataProductos(productos);
        console.log("data productos", productos);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!logoProducto) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    }

    try {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `ImgProductosmenu/${nombreEmpresa}/${logoProducto.name}`
      );

      // Subir el archivo a Firebase Storage
      await uploadBytes(storageRef, logoProducto);

      // Obtener la URL de descarga del archivo
      const logoURL = await getDownloadURL(storageRef);

      const newProduct = {
        nombre: nombreProducto,
        precio: valorProducto,
        descripcion: descripcionProducto,
        foto: logoURL,
        categoriaItem: categoriaMenu,
        calificación: calificacionProducto,
        estado: estadoProducto,
        menuItem: menu,
        popular: "1",
      };

      // Enviar los datos a la API
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/productos/new/${identificador}`,
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
        closeModal();
      } else {
        const result = await response.json();
        setAlertMessage("Producto añadido con éxito");
        setShowAlert(true);
        setNombreProducto("");
        setValorProducto("");
        closeModal();
        fetchProductos();
      }
    } catch (error) {
      console.error("Error registrando el producto:", error);
      setAlertMessage("Error al registrar el producto. Inténtalo nuevamente.");
      setShowErrorAlert(true);
    }
  };
  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/productos/${identificador}/${selectedProduct.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setAlertMessage("Error al eliminar el producto. Inténtalo nuevamente.");
        setShowErrorAlert(true);
        closeModall();
      }

      setAlertMessage("Producto eliminado con éxito");
      setShowAlert(true);
      closeModall();
      fetchProductos();
    } catch (error) {
      // console.error("Error deleting product:", error);
    }
  };
  //editar produtcto funcion
  const openEditModal = (product) => {
    setProductToEdit(product);
    setNombreProducto(product.nombre);
    setValorProducto(product.valor);
    setdescripcionProducto(product.descripcion);
    setMenu(product.menuItem);
    setcategoriaMenu(product.categoriaItem);
    setcalificacionProducto(product.calificación);
    setestadoProducto(product.estado);
    setEditModalOpen(true);
    console.log(product);
  };

  const closeEditModal = () => {
    setProductToEdit(null);
    setNombreProducto("");
    setValorProducto("");
    setdescripcionProducto("");
    setMenu("");
    setcategoriaMenu("");
    setcalificacionProducto("");
    setestadoProducto("");
    setEditModalOpen(false);
  };

  const handleEditSubmit = async (e, logoURL) => {
    e.preventDefault();

    if (!productToEdit) {
      // console.error("No product to edit");
      return;
    }
    const updatedProduct = {
      ...productToEdit,
      nombre: nombreProducto,
      precio: valorProducto,
      descripcion: descripcionProducto,
      foto: logoURL,
      categoriaItem: categoriaMenu,
      calificación: calificacionProducto,
      estado: estadoProducto,
      menuItem: menu,
    };

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/productos/actualizar/${identificador}/${productToEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        setAlertMessage("Error al editar el producto. Inténtalo nuevamente.");
        setShowErrorAlert(true);
        closeEditModal();
      }

      const result = await response.json();
      // console.log("Product updated successfully:", result);
      setAlertMessage("Producto actualizado con éxito");
      setShowAlert(true);
      closeEditModal();
      fetchProductos();
    } catch (error) {
      // console.error("Error updating product:", error);
    }
  };

  
//Obtner Menus
  const fetchMenus = async () => {
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

      const userDocRef = collection(db, "categoriaMenu", uidUser, "Menus");

      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        const menus = [];
        snapshot.forEach((doc) => {
          menus.unshift({ IdMenu: doc.id, ...doc.data() });
        });

        setDataMenus(menus);
        console.log("data productos", menus);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);
//Obtener 
  const fetchCategoriaMenu = async () => {
    try {
      // Paso 1: Consultar la colección "usuarios" para obtener el UID del usuario
      const userQuery = query(
        collection(db, "usuarios"),
        where("identificador", "==", identificador) // Asegúrate de tener disponible el identificador
      );

      const querySnapshot = await getDocs(userQuery);
      let uidUser = "";
      querySnapshot.forEach((doc) => {
        uidUser = doc.id; // Obtenemos el ID del documento del usuario
      });

      if (!uidUser) {
        console.error("Usuario no encontrado");
        return;
      }

      // Paso 2: Obtener todos los menús del usuario
      const menusCollectionRef = collection(
        db,
        "categoriaMenu",
        uidUser,
        "Menus"
      );
      const menusSnapshot = await getDocs(menusCollectionRef);
      const menusId = [];
      menusSnapshot.forEach((doc) => {
        menusId.unshift({ id: doc.id });
      });

      console.log(menusId, "menusId");

      // Paso 3: Crear un array para almacenar todas las categorías de todos los menús
      const todasLasCategorias = [];

      // Paso 4: Recorrer todos los menús y traer las categorías de cada uno
      const unsubscribeArray = menusId.map((menuDoc) => {
        const menuId = menuDoc.id; // Obtener el ID del menú actual
        const categoriasCollectionRef = collection(
          db,
          "categoriaMenu",
          uidUser,
          "Menus",
          menuId,
          "categorias"
        );

        // Escuchar los cambios en cada subcolección de categorías
        return onSnapshot(categoriasCollectionRef, (snapshot) => {
          const categorias = [];
          snapshot.forEach((doc) => {
            categorias.push({ id: doc.id, ...doc.data() });
          });

          // Añadir las categorías al array principal
          todasLasCategorias.push(...categorias);

          // Actualizar el estado con todas las categorías obtenidas
          setDataCategorias([...todasLasCategorias]);
          console.log("Categorías obtenidas:", todasLasCategorias);
        });
      });

      // Retornar una función para desuscribirse de todas las colecciones si es necesario
      return () => {
        unsubscribeArray.forEach((unsubscribe) => unsubscribe());
      };
    } catch (error) {
      console.error("Error al obtener las categorías:", error.message);
    }
  };

  // Ejecutar la función en el useEffect
  useEffect(() => {
    fetchCategoriaMenu();
  }, []);

  // Filtrar las categorías según el IdMenu seleccionado
  const categoriasFiltradas = DataCategorias.filter(
    (categoria) => categoria.IdMenu === selectedMenu
  );

  const handleMenuChange = (event) => {
    const selectedMenuId = event.target.value;

    // Actualiza ambos estados
    setMenu(selectedMenuId); // Actualiza el menú
    setSelectedMenu(selectedMenuId); // Actualiza el menú seleccionado
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
          Productos
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
                  placeholder="Buscar orden..."
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

          <button
            onClick={openModal}
            data-modal-target="authentication-modal"
            data-modal-toggle="authentication-modal"
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Añadir Producto
          </button>
          <Modal
            className="h-auto"
            isOpen={isModalOpen}
            nombre="Añadir Nuevo Producto"
            onClose={closeModal}
            size="auto"
            Fondo="auto"
          >
            <div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="p-4">
                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label
                        htmlFor="text"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nombre Producto
                      </label>
                      <input
                        type="text"
                        name="nombreProducto"
                        value={nombreProducto}
                        onChange={(e) => setNombreProducto(e.target.value)}
                        id="nombreProducto"
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                        placeholder="Nombre producto"
                        required
                      />
                    </div>
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label
                        htmlFor="number"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Descripción Producto
                      </label>
                      <input
                        type="text"
                        name="descripcionProducto"
                        value={descripcionProducto}
                        onChange={(e) => setdescripcionProducto(e.target.value)}
                        id="descripcionProducto"
                        placeholder="Descripción producto"
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                        required
                      />
                    </div>
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label
                        htmlFor="number"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Valor Producto
                      </label>
                      <input
                        type="number"
                        name="valorProducto"
                        value={valorProducto}
                        onChange={(e) => setValorProducto(e.target.value)}
                        id="valorProducto"
                        placeholder="Valor producto"
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                        required
                      />
                    </div>
                  </div>

                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label
                        htmlFor="text"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Imagen Producto
                      </label>
                      <input
                        type="file"
                        id="imgProducto"
                        onChange={handleImageChange}
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                        required
                      />
                    </div>
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Menú
                      </label>
                      <select
                        className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        defaultValue=""
                        required
                        id="menu"
                        onChange={handleMenuChange}
                      >
                        <option value="" hidden>
                          Selecciona un menú
                        </option>
                        {DataMenus.map((menu) => (
                          <option value={menu.IdMenu}>{menu.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label
                        htmlFor="number"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Categoria Menú
                      </label>
                      <select
                        className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        defaultValue=""
                        required
                        onChange={handlemenuCategory}
                        id="categoriaMenu"
                      >
                        <option value="" hidden>
                          Selecciona una categoria del menú
                        </option>
                        {categoriasFiltradas.length > 0 ? (
                          categoriasFiltradas.map((categoria) => (
                            <option value={categoria.IdCategoria
                            }>
                              {categoria.nombre}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No hay categorías para este menú
                          </option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Calificación Producto
                      </label>
                      <select
                        className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        defaultValue=""
                        required
                        id="calificacionProducto"
                        onChange={handlecalificacionProducto}
                      >
                        <option value="" hidden>
                          Selecciona una opción
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label
                        htmlFor="number"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Estado Producto
                      </label>
                      <select
                        className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                        defaultValue=""
                        required
                        onChange={handleEstadoProdcuto}
                        id="estadoProducto"
                      >
                        <option value="" hidden>
                          Selecciona una opción
                        </option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Añadir Producto
                </button>
              </form>
            </div>
          </Modal>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nombre Producto
              </th>
              <th scope="col" className="px-6 py-3">
                Imagen 
              </th>
              <th scope="col" className="px-6 py-3">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3">
                Precio
              </th>
              <th scope="col" className="px-6 py-3">
                Menú
              </th>
              <th scope="col" className="px-6 py-3">
                Categoria
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
                <td colSpan="10" className="text-center text-base mt-14 mb-14">
                  No hay productos disponibles por favor agregue un producto
                </td>
              </tr>
            ) : (
              currentProducts.map((product, index ,menu) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.nombre}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <img
                      className="h-12 w-12 rounded-md"
                      src={product.foto}
                    ></img>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.descripcion}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {`${Number(product.valor).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}`}{" "}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.nombre}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.categoriaItem}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <span
                      className={
                        product.estado === "Inactivo"
                          ? "bg-red-100 text-red-800 font-medium py-1  px-4  rounded-full dark:bg-red-900 dark:text-red-300"
                          : "bg-green-100 text-green-800  font-medium py-1  px-4 rounded-full dark:bg-green-900 dark:text-green-300"
                      }
                    >
                      {product.estado}
                    </span>
                  </td>
            
                  <td className="px-3 py-4 flex gap-2">
                    <Tooltip content="Editar">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900"
                      >
                        <FaRegEdit />
                      </button>
                    </Tooltip>
                    <Tooltip content="Eliminar">
                      <button
                        type="button"
                        onClick={() => openModall(product)}
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
        <Modal
          className="h-auto"
          isOpen={editModalOpen}
          nombre="Editar Producto"
          onClose={closeEditModal}
          size="auto"
          Fondo="auto"
        >
          <div>
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div className="p-4">
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      htmlFor="text"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nombre Producto
                    </label>
                    <input
                      type="text"
                      name="nombreProducto"
                      value={nombreProducto}
                      onChange={(e) => setNombreProducto(e.target.value)}
                      id="nombreProducto"
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                      placeholder="Nombre producto"
                      required
                    />
                  </div>
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      htmlFor="number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Descripción Producto
                    </label>
                    <input
                      type="text"
                      name="descripcionProducto"
                      value={descripcionProducto}
                      onChange={(e) => setdescripcionProducto(e.target.value)}
                      id="descripcionProducto"
                      placeholder="Descripción producto"
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                      required
                    />
                  </div>
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      htmlFor="number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Valor Producto
                    </label>
                    <input
                      type="number"
                      name="valorProducto"
                      value={valorProducto}
                      onChange={(e) => setValorProducto(e.target.value)}
                      id="valorProducto"
                      placeholder="Valor producto"
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                      required
                    />
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      htmlFor="text"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Imagen Producto
                    </label>
                    <input
                      type="file"
                      id="imgProducto"
                      onChange={handleImageChange}
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    />
                  </div>
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Menú
                    </label>
                    <select
                      className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      defaultValue=""
                      id="menu"
                      value={menu || ""}
                      onChange={(e) => setMenu(e.target.value)}
                    >
                      <option value="" disabled>
                        {menu ? "Selecciona una menú" : "Sin menú definido"}
                      </option>
                      <option value="MenuPrincipal">Menu Principal</option>
                      <option value="Menu segundario">Menu segundario</option>
                      <option value="Menu x">Menu x</option>
                      <option value="Menu a">Menu a</option>
                      <option value="Menu e">Menu e</option>
                    </select>
                  </div>
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      htmlFor="number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Categoria Menú
                    </label>
                    <select
                      className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      defaultValue=""
                      value={categoriaMenu || ""}
                      onChange={(e) => setcategoriaMenu(e.target.value)}
                      id="categoriaMenu"
                    >
                      <option value="" disabled>
                        {categoriaMenu
                          ? "Selecciona una categoria"
                          : "Sin categoria definida"}
                      </option>
                      <option value="Entradas">Entradas</option>
                      <option value="Fuertes">Fuertes</option>
                      <option value="Hamburguezas">Hamburguezas</option>
                      <option value="Perros Calientes">Perros Calientes</option>
                      <option value="Bebidas">Bebidas</option>
                    </select>
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Calificación Producto
                    </label>
                    <select
                      className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      defaultValue=""
                      value={calificacionProducto || ""}
                      onChange={(e) => setcalificacionProducto(e.target.value)}
                      id="calificacionProducto"
                    >
                      <option value="" disabled>
                        {calificacionProducto
                          ? "Selecciona una calificación"
                          : "Sin calificación definida"}
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label
                      htmlFor="number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Estado Producto
                    </label>
                    <select
                      className="block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                      defaultValue=""
                      value={estadoProducto || ""}
                      onChange={(e) => setestadoProducto(e.target.value)}
                      id="estadoProducto"
                    >
                      <option value="" disabled>
                        {estadoProducto
                          ? "Selecciona un estado"
                          : "Sin estado definido"}
                      </option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-96 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Actualizar Producto
              </button>
            </form>
          </div>
        </Modal>
        <Modal
          isOpen={isModalOpenn}
          nombre="Eliminar Producto"
          onClose={closeModall}
          size="auto"
          Fondo="auto"
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
                  onClick={handleDelete}
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
            filteredProducts.length / rowsPerPage
          )}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredProducts.length / rowsPerPage)
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

export default Productos;
