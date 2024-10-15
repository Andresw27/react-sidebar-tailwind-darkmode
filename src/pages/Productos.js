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
  const [SelectedMenuNombre, setSelectedMenuNombre] = useState(null);
  const [productoConVariaciones, setProductoConVariaciones] = useState(false);
  const [variaciones, setVariaciones] = useState([]);
  const [SelectedCategoryNombre, setSelectedCategoryNombre] = useState(null);
  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  //funciones de cambios en los inputs
  const handlemenu = (event) => {
    setMenu(event.target.value);
    console.log(menu);
  };
  const handlemenuCategory = (event) => {
    const selectedCategoryId = event.target.value;

    // Busca la categoría seleccionada en el arreglo DataCategorias
    const selectedCategory = DataCategorias.find(
      (category) => category.IdCategoria === selectedCategoryId
    );

    // Actualiza el estado con el Id de la categoría
    setcategoriaMenu(selectedCategoryId);

    // Si la categoría existe, actualiza el estado con el nombre de la categoría
    if (selectedCategory) {
      setSelectedCategoryNombre(selectedCategory.nombre); // Actualiza el estado con el nombre
      console.log(selectedCategory.nombre);
      console.log(SelectedCategoryNombre); // Muestra el nombre de la categoría en la consola
    }
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
    const file = e.target.files[0];
    if (file) {
      setlogoProducto(file); // Guardar el archivo seleccionado
    }
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

      // Crear el objeto del nuevo producto, con o sin variaciones
      let newProduct;

      if (productoConVariaciones) {
        // Si el producto tiene variaciones, agregar las variaciones
        newProduct = {
          nombre: nombreProducto,
          descripcion: descripcionProducto,
          foto: logoURL,
          categoriaItem: categoriaMenu,
          calificación: calificacionProducto,
          estado: estadoProducto,
          menuItem: menu,
          popular: "1",
          menuNombre: SelectedMenuNombre,
          nombreCategoria: SelectedCategoryNombre,
          variacion: variaciones.map((variacion) => ({
            descripcion: variacion.descripcion,
            precio: variacion.valor,
          })),
        };
      } else {
        // Si el producto no tiene variaciones, agregar el valor general
        newProduct = {
          nombre: nombreProducto,
          precio: valorProducto,
          descripcion: descripcionProducto,
          foto: logoURL,
          categoriaItem: categoriaMenu,
          calificación: calificacionProducto,
          estado: estadoProducto,
          menuItem: menu,
          popular: "1",
          menuNombre: SelectedMenuNombre,
          nombreCategoria: SelectedCategoryNombre,
          recomendado:"1",
          nuevo:"1"
        };
      }
      console.log(newProduct, "producto");
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
        console.log(newProduct);
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
  //Eliminar Producto
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    if (!productToEdit) {
      return;
    }
  
    // Si logoProducto es un archivo, obtén la URL, de lo contrario, usa la foto existente
    let fotoUrl;
    if (logoProducto) {
      const storage = getStorage();
      const storageRef = ref(storage, `ImgProductosmenu/${nombreEmpresa}/${logoProducto.name}`);
      await uploadBytes(storageRef, logoProducto); // Sube la nueva imagen
      fotoUrl = await getDownloadURL(storageRef); // Obtiene la URL de descarga
    } else {
      fotoUrl = productToEdit.foto; // Usa la imagen existente si no hay nuevo archivo
    }
  
    const updatedProduct = {
      ...productToEdit,
      nombre: nombreProducto,
      precio: valorProducto,
      descripcion: descripcionProducto,
      foto: fotoUrl,
      categoriaItem: categoriaMenu,
      calificación: calificacionProducto,
      estado: estadoProducto,
      menuItem: menu,
      nombreCategoria:SelectedCategoryNombre,
      menuNombre:SelectedMenuNombre
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
        const errorText = await response.text();
        console.log("Server response:", errorText);
        setAlertMessage("Error al editar el producto. Inténtalo nuevamente.");
        setShowErrorAlert(true);
        closeEditModal();
      } else {
        const result = await response.json();
        setAlertMessage("Producto actualizado con éxito");
        setShowAlert(true);
        closeEditModal();
        fetchProductos();
      }
    } catch (error) {
      console.error("Error updating product:", error);
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

    // Busca el menú en DataMenus utilizando el IdMenu
    const selectedMenu = DataMenus.find(
      (menu) => menu.IdMenu === selectedMenuId
    );

    // Actualiza el estado con el IdMenu seleccionado
    setMenu(selectedMenuId);
    setSelectedMenu(selectedMenuId);

    // Si el menú existe, actualiza el estado con el nombre del menú
    if (selectedMenu) {
      setSelectedMenuNombre(selectedMenu.nombre); // Almacena el nombre del menú
      console.log(selectedMenu.nombre); // Muestra el nombre en la consola
    }
  };

  const agregarVariacion = () => {
    setVariaciones([...variaciones, { descripcion: "", valor: "" }]);
  };

  const eliminarVariacion = (index) => {
    const nuevasVariaciones = [...variaciones];
    nuevasVariaciones.splice(index, 1);
    setVariaciones(nuevasVariaciones);
  };

  const handleVariacionChange = (index, campo, valor) => {
    const nuevasVariaciones = [...variaciones];
    nuevasVariaciones[index][campo] = valor;
    setVariaciones(nuevasVariaciones);
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
            size="fixed"
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

                    {/* Checkbox para indicar si el producto tiene variaciones */}

                    {/* Si el producto NO tiene variaciones, mostrar el campo de valor general */}
                    {!productoConVariaciones && (
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
                    )}
                    <div className="md:w-full px-3 mb-6 md:mb-0">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        ¿Producto con variaciones de precio?
                      </label>
                      <input
                        type="checkbox"
                        name="productoConVariaciones"
                        checked={productoConVariaciones}
                        onChange={(e) =>
                          setProductoConVariaciones(e.target.checked)
                        }
                      />
                    </div>

                    {/* Si el producto TIENE variaciones, mostrar los inputs dinámicos */}
                  </div>
                  <div className="-mx-3 md:flex mb-6">
                    {productoConVariaciones && (
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label
                          htmlFor="number"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Variaciones del Producto
                        </label>

                        {variaciones.map((variacion, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 mb-4"
                          >
                            <input
                              type="text"
                              name="descripcionVariacion"
                              value={variacion.descripcion}
                              onChange={(e) =>
                                handleVariacionChange(
                                  index,
                                  "descripcion",
                                  e.target.value
                                )
                              }
                              placeholder="Descripción de la variación "
                              className="appearance-none block w-full bg-grey-lighter text-grey-darker border rounded py-3 px-4 mb-3"
                            />
                            <input
                              type="number"
                              name="valorVariacion"
                              value={variacion.valor}
                              onChange={(e) =>
                                handleVariacionChange(
                                  index,
                                  "valor",
                                  e.target.value
                                )
                              }
                              placeholder="Valor de la variación"
                              className="appearance-none block w-full bg-grey-lighter text-grey-darker border rounded py-3 px-4 mb-3"
                            />
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => eliminarVariacion(index)}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="text-blue-500 px-2 text-center text-2xl bg-slate-100 rounded-full"
                          onClick={agregarVariacion}
                        >
                          +
                        </button>
                      </div>
                    )}
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
                        {DataMenus.length > 0 ? (
                          DataMenus.map((menu) => (
                            <option key={menu.IdMenu} value={menu.IdMenu}>
                              {menu.nombre}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No hay menús configurados
                          </option>
                        )}
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
                            <option value={categoria.IdCategoria}>
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
        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">
                Nombre Producto
              </th>
              <th scope="col" className="px-4 py-2">
                Imagen
              </th>
              <th scope="col" className="px-4 py-2">
                Descripción General
              </th>
              <th scope="col" className="px-4 py-2">
                Descripción producto va
              </th>
              <th scope="col" className="px-4 py-2">
                Precio
              </th>
              <th scope="col" className="px-4 py-2">
                Menú
              </th>
              <th scope="col" className="px-4 py-2">
                Categoria
              </th>
              <th scope="col" className="px-4 py-2">
                Estado
              </th>
              <th scope="col" className="px-4 py-2">
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
              currentProducts.map((product, index) => (
                <tr
                  key={index}
                  className="bg-white text-sm border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    {product.nombre}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    <img className="h-10 w-10 rounded-md" src={product.foto} />
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    {product.descripcion}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    {" "}
                    {product.variacion ? (
                      product.variacion.map((valor) => (
                        <p key={valor.id}>- {valor.descripcion}</p>
                      ))
                    ) : (
                      <p>No aplica</p>
                    )}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    {product.variacion
                      ? product.variacion.map((valor) => (
                          <p key={valor.id}>
                            {`${Number(valor.precio).toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}`}{" "}
                          </p>
                        ))
                      : `${Number(product.valor).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}`}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    {product.menuNombre}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    {product.nombreCategoria}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    <span
                      className={
                        product.estado === "Inactivo"
                          ? "bg-red-100 text-red-800 py-1 px-3 rounded-full dark:bg-red-900 dark:text-red-300"
                          : "bg-green-100 text-green-800 py-1 px-3 rounded-full dark:bg-green-900 dark:text-green-300"
                      }
                    >
                      {product.estado}
                    </span>
                  </td>
                  <td className="px-3 py-2 flex gap-2">
                    <Tooltip content="Editar">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="text-white bg-yellow-400 hover:bg-yellow-500 p-2.5 rounded-lg"
                      >
                        <FaRegEdit />
                      </button>
                    </Tooltip>
                    <Tooltip content="Eliminar">
                      <button
                        type="button"
                        onClick={() => openModall(product)}
                        className="text-white bg-red-700 hover:bg-red-800 p-2.5 rounded-lg"
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
    <div className="grid grid-cols-3 gap-6">
  <div className="col-span-1">
    {productToEdit && productToEdit.foto && (
      <img
        src={productToEdit.foto}
        alt="Imagen actual del producto"
        className="mb-4 max-w-full max-h-[400px] object-cover"
      />
    )}
  </div>

  <div className="col-span-2">
    <form className="space-y-6" onSubmit={handleEditSubmit}>
      <div className="p-6 h-[400px] overflow-y-auto rounded-lg shadow-md">
        {/* Nombre Producto */}
        <div className="mb-4">
          <label
            htmlFor="nombreProducto"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Nombre Producto
          </label>
          <input
            type="text"
            id="nombreProducto"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
            placeholder="Nombre producto"
            required
          />
        </div>

        {/* Descripción Producto */}
        <div className="mb-4">
          <label
            htmlFor="descripcionProducto"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Descripción Producto
          </label>
          <input
            type="text"
            id="descripcionProducto"
            value={descripcionProducto}
            onChange={(e) => setdescripcionProducto(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
            placeholder="Descripción producto"
            required
          />
        </div>

        {/* Checkbox: ¿Producto con variaciones? */}
        <div className="mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={productoConVariaciones}
              onChange={(e) => setProductoConVariaciones(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-900">
              ¿Producto con variaciones de precio?
            </span>
          </label>
        </div>

        {/* Valor Producto (si no tiene variaciones) */}
        {!productoConVariaciones && (
          <div className="mb-4">
            <label
              htmlFor="valorProducto"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Valor Producto
            </label>
            <input
              type="number"
              id="valorProducto"
              value={valorProducto}
              onChange={(e) => setValorProducto(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
              placeholder="Valor producto"
              required
            />
          </div>
        )}

        {/* Variaciones del Producto (si tiene variaciones) */}
        {productoConVariaciones && (
          <div className="mb-4">
            <label
              htmlFor="variacionesProducto"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Variaciones del Producto
            </label>

            {variaciones.map((variacion, index) => (
              <div key={index} className="flex items-center space-x-4 mb-3">
                <input
                  type="text"
                  value={variacion.descripcion}
                  onChange={(e) =>
                    handleVariacionChange(index, "descripcion", e.target.value)
                  }
                  placeholder="Descripción de la variación"
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
                />
                <input
                  type="number"
                  value={variacion.valor}
                  onChange={(e) =>
                    handleVariacionChange(index, "valor", e.target.value)
                  }
                  placeholder="Valor de la variación"
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => eliminarVariacion(index)}
                >
                  Eliminar
                </button>
              </div>
            ))}

            <button
              type="button"
              className="text-blue-500 px-2 py-1 bg-blue-100 rounded-full"
              onClick={agregarVariacion}
            >
              +
            </button>
          </div>
        )}

        {/* Imagen Producto */}
        <div className="mb-4">
          <label
            htmlFor="imgProducto"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Imagen Producto
          </label>
          <input
            type="file"
            id="imgProducto"
            onChange={handleImageChange}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
          />
        </div>

        {/* Menú */}
        <div className="mb-4">
          <label
            htmlFor="menu"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Menú
          </label>
          <select
            id="menu"
            value={menu || ""}
            onChange={handleMenuChange}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
          >
            <option value="" hidden>
              {menu ? "Selecciona una categoría" : "Sin categoría definida"}
            </option>
            {DataMenus.length > 0 ? (
              DataMenus.map((menu) => (
                <option key={menu.IdMenu} value={menu.IdMenu}>
                  {menu.nombre}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No hay menús configurados
              </option>
            )}
          </select>
        </div>

        {/* Categoría Menú */}
        <div className="mb-4">
          <label
            htmlFor="categoriaMenu"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Categoría Menú
          </label>
          <select
            id="categoriaMenu"
            value={categoriaMenu || ""}
            onChange={handlemenuCategory}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
          >
            <option value="" hidden>
              {categoriaMenu
                ? "Selecciona una categoría"
                : "Sin categoría definida"}
            </option>
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((categoria) => (
                <option key={categoria.IdCategoria} value={categoria.IdCategoria}>
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

        {/* Calificación Producto */}
        <div className="mb-4">
          <label
            htmlFor="calificacionProducto"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Calificación Producto
          </label>
          <select
            id="calificacionProducto"
            value={calificacionProducto}
            onChange={handlecalificacionProducto}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
            required
          >
            <option value="" hidden>
              Selecciona una opción
            </option>
            {[1, 2, 3, 4, 5].map((cal) => (
              <option key={cal} value={cal}>
                {cal}
              </option>
            ))}
          </select>
        </div>

        {/* Estado Producto */}
        <div className="mb-4">
          <label
            htmlFor="estadoProducto"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Estado Producto
          </label>
          <select
            id="estadoProducto"
            value={estadoProducto}
            onChange={handleEstadoProdcuto}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900"
            required
          >
            <option value="" hidden>
              Selecciona un estado
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Botón de Actualización */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Actualizar Producto
      </button>
    </form>
  </div>
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
