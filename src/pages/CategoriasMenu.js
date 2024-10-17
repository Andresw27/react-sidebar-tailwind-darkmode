import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { IoSearch } from "react-icons/io5";
import { IoFastFoodSharp } from "react-icons/io5";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase Storage
import { FaRegEdit, FaRegTrashAlt, FaRegCopy } from "react-icons/fa";
import Alert from "../components/Alert"; // Importa el componente de alerta

import { Tooltip } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { db } from "../firebase-config";

import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  updateDoc,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";

function CategoriasMenu() {
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState("");
  const { identificador, nombreEmpresa } = useSelector((state) => state.user);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [OpenModalNewMenu, setOpenModalNewMenu] = useState("");
  const [nombreMenunew, setnombreMenunew] = useState("");
  const [descripcionMenunew, setdescripcionMenunew] = useState("");
  const [OpenNewCategoria, setOpenNewCategoria] = useState("");
  const [nombreCategoria, setnombreCategoria] = useState("");
  const [descripcionCategoria, setdescripcionCategoria] = useState("");
  const [fotoCategoria, setfotoCategoria] = useState("");
  const [DataMenus, setDataMenus] = useState([]);
  const [DataCategorias, setDataCategorias] = useState([]);
  const [dataProductos, setDataProductos] = useState([]);
  const [modalviewproductoscategoria, setmodalviewproductoscategoria] =
    useState("");
  const [categoriaselect, setcategoriaselect] = useState(null);
  const [openDropdownmenu, setopenDropdownmenu] = useState("");
  const [openDropdownmenuCategorias, setopenDropdownmenuCategorias] =
    useState("");
  const [editMenu, seteditMenu] = useState("");
  const [selectmenu, setselectmenu] = useState(null);
  const [deletemenu, setdeletemenu] = useState(null);
  const [editcategoriamenu, seteditcategoriamenu] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectcategoriamenu, setselectcategoriamenu] = useState(null);
  const [deletecategoriamenu, setdeletecategoriamenu] = useState("");
  const [selectcategoriamenudele, setselectcategoriamenudele] = useState(null);
  const [opencopyrutaMenu, setopencopyrutaMenu] = useState("");
  const [categoriaActiva, setcategoriaActiva] = useState(false);

  //modales new categoria de menu
  const handleOpenmodalcopymenu = (menu) => {
    setopencopyrutaMenu(true);
    setselectmenu(menu);
  };

  const handleClosedmodalcopymenu = () => {
    setopencopyrutaMenu(false);
    setopenDropdownmenu(false);
  };

  const handleCopyToClipboard = () => {
    const menuRuta = `https://go.jeicy.co/${nombreEmpresa}/menu/${selectmenu?.IdMenu}`;
    navigator.clipboard
      .writeText(menuRuta)
      .then(() => {
        setAlertMessage("Ruta copiada con éxito");
        setShowAlert(true);
        handleClosedmodalcopymenu(); // Cerrar modal después de copiar
      })
      .catch((error) => {
        console.error("Error al copiar la ruta:", error);
      });
  };
  //modales new categoria de menu
  const handleopenmodalnewcategoriamenu = () => {
    setOpenNewCategoria(true);
  };

  const handleclosedmodalnewcategoriamenu = () => {
    setOpenNewCategoria(false);
  };

  //modales new menu
  const handleopenmodalnewmenu = () => {
    setOpenModalNewMenu(true);
  };

  const handleclosedmodalnewmenu = () => {
    setOpenModalNewMenu(false);
  };

  //modals editar menu

  const handleOpeneditmodal = (menu) => {
    seteditMenu(true);
    setnombreMenunew(menu.nombre);
    setdescripcionMenunew(menu.descripcion);
    setselectmenu(menu.IdMenu);
    console.log(menu, "menu seleccionado");
  };

  const handleClosededitmodal = (menu) => {
    seteditMenu(false);
    setselectmenu(menu);
    setnombreMenunew("");
    setdescripcionMenunew("");
    setopenDropdownmenu(false);
  };

  // Función para manejar el click y establecer el menú seleccionado
  const handleMenuClick = (IdMenu) => {
    setSelectedMenu(IdMenu);
  };

  // Filtrar las categorías según el IdMenu seleccionado
  const categoriasFiltradas = DataCategorias.filter(
    (categoria) => categoria.IdMenu === selectedMenu
  );

  //funcion para traer los menus
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

  //añadir nuevo menu
  const handleAddNewMenu = async (e) => {
    e.preventDefault();

    const newMenuData = {
      nombre: nombreMenunew,
      descripcion: descripcionMenunew,
    };
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

    try {
      // Guardar el nuevo menú en Firestore en la colección "menus"
      await addDoc(
        collection(db, "categoriaMenu", uidUser, "Menus"),
        newMenuData
      );

      // Limpiar los campos del formulario
      handleclosedmodalnewmenu();
      setdescripcionMenunew("");
      setnombreMenunew("");
      setAlertMessage("Menú Agregado con éxito");
      setShowAlert(true);
      console.log("Menu añadido exitosamente a Firestore.");
    } catch (error) {
      console.error("Error al añadir el menú: ", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Captura el archivo seleccionado
    setfotoCategoria(file);
    // Si el archivo existe, crea una URL para previsualizar
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Almacena la URL en el estado
      };
      reader.readAsDataURL(file); // Convierte la imagen a Data URL
    }
  };

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

  const getRandomIdentifier = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 20;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  };

  //añadir nueva categoria a un menu seleccionado
  const handleAddNewCategoriaMenu = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    if (!selectedMenu) {
      console.error("No se ha seleccionado ningún menú.");
      return;
    } else {
      console.log("Menú seleccionado encontrado:", selectedMenu);
    }

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
      // Referencia al almacenamiento de Firebase
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `ImgProductosmenu/${nombreEmpresa}/${fotoCategoria.name}`
      );

      // Subir el archivo a Firebase Storage
      await uploadBytes(storageRef, fotoCategoria);

      // Obtener la URL de descarga del archivo
      const logoURL = await getDownloadURL(storageRef);

      // Crear el objeto con los datos de la nueva categoría
      const newMenuData = {
        nombre: nombreCategoria,
        descripcion: descripcionCategoria,
        foto: logoURL, // Usar la URL obtenida como foto de la categoría
        IdCategoria: getRandomIdentifier(), // Usa el IdMenu del menú seleccionado
        IdMenu: selectedMenu,
        activeCategory: categoriaActiva,
      };

      // Guardar la nueva categoría en Firestore (dentro del menú seleccionado)
      await addDoc(
        collection(
          db,
          "categoriaMenu",
          uidUser,
          "Menus",
          selectedMenu,
          "categorias"
        ),
        newMenuData
      );

      // Actualizar el estado local de las categorías si es necesario
      setDataCategorias([...DataCategorias, newMenuData]);

      // Limpiar los campos del formulario
      handleclosedmodalnewcategoriamenu();
      setdescripcionCategoria("");
      setnombreCategoria("");
      setfotoCategoria("");
      setAlertMessage("Categoria Agregada éxitosamente");
      setShowAlert(true);
      console.log("Categoría añadida exitosamente a Firestore.");
    } catch (error) {
      console.error("Error al añadir la categoría o subir la imagen:", error);
    }
  };

  // Contar cuántas categorías hay en el menú seleccionado
  const Categoriasfiltradaspormenu = categoriasFiltradas.length;

  //obtenerProductos
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
  //

  //modal view productos categorias

  const handleopenmodalviewproductoscategorias = (categoria) => {
    setmodalviewproductoscategoria(true);
    setcategoriaselect(categoria);
    console.log(categoria, "categoria select");
  };
  const handleclosedmodalviewproductoscategorias = () => {
    setmodalviewproductoscategoria(false);
  };

  //dropdown para opciones de eliminar y editAR menu

  const handleopenDropdownmenu = (menu) => {
    setopenDropdownmenu((prevId) =>
      prevId === menu.IdMenu ? null : menu.IdMenu
    );
    setopenDropdownmenuCategorias(false);
    console.log(menu);
  };

  const handleopenDropdownmenuCategorias = (categorias) => {
    setopenDropdownmenuCategorias((prevId) =>
      prevId === categorias.IdCategoria ? null : categorias.IdCategoria
    );
    console.log(categorias);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setopenDropdownmenu(false);
      }
    };

    // Attach event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setopenDropdownmenuCategorias(false);
      }
    };

    // Attach event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //funcion para editar menu
  const handleEditMenu = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    try {
      // Obtener el UID del usuario basado en el identificador
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

      // Referencia al documento de la publicidad a editar
      const publicidadRef = doc(
        db,
        "categoriaMenu",
        uidUser,
        "Menus",
        selectmenu
      );

      const updatedPublicidad = {
        nombre: nombreMenunew || selectmenu.nombre,
        descripcion: descripcionMenunew || selectmenu.descripcion,
      };

      // Actualizar la publicidad en Firestore
      await updateDoc(publicidadRef, updatedPublicidad);
      handleClosededitmodal();
      setAlertMessage("Menú Actualizado con éxito");
      setShowAlert(true);
      console.log("Publicidad editada exitosamente en Firestore.");
      fetchMenus();
    } catch (error) {
      console.error("Error al editar la publicidad:", error);
    }
  };

  //funcion abrir modal eliminar menu
  const HandleopenModaldeletemenu = (menu) => {
    setdeletemenu(true);
    setselectmenu(menu);
    console.log(menu);
  };
  const HandleclosedModaldeletemenu = (publicidad) => {
    setdeletemenu(false);
    setopenDropdownmenu(false);
  };

  //funcion para eliminar menu
  const handleDeleteMenu = async (selectmenu) => {
    try {
      // Obtener el UID del usuario basado en el identificador
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

      // Referencia al menú a eliminar
      const menuRef = doc(
        db,
        "categoriaMenu",
        uidUser,
        "Menus",
        selectmenu.IdMenu
      );

      // Obtener las categorías asociadas dentro del menú
      const categoriasQuery = query(collection(menuRef, "categorias")); // Suponiendo que "categorias" es la subcolección
      const categoriasSnapshot = await getDocs(categoriasQuery);

      // Eliminar cada categoría individualmente
      const batch = writeBatch(db); // Usar batch para realizar todas las operaciones en una sola transacción
      categoriasSnapshot.forEach((doc) => {
        batch.delete(doc.ref); // Eliminar cada documento de la subcolección
      });

      // Ejecutar el batch para eliminar todas las categorías
      await batch.commit();

      console.log("Categorías eliminadas de Firestore");

      // Eliminar el menú
      await deleteDoc(menuRef);
      console.log("Menú eliminado de Firestore");

      // Limpiar el formulario y cerrar el modal
      HandleclosedModaldeletemenu();
      setAlertMessage("Menú Eliminado con éxito");
      setShowAlert(true);
      // Actualizar los menús
      fetchMenus();
    } catch (error) {
      console.error("Error al eliminar el menú y sus categorías:", error);
    }
  };

  //funciones para abrir y cerrar modal de editar categoria

  const handleOpeneditCategoriamenu = (categoria) => {
    seteditcategoriamenu(true);
    setselectcategoriamenu({
      IdMenu: categoria.IdMenu, // Asegúrate de que este campo existe en el objeto 'categoria'
      id: categoria.id,
    });
    setdescripcionCategoria(categoria.descripcion);
    setnombreCategoria(categoria.nombre);
    setfotoCategoria(categoria.foto);
    setPreviewUrl(categoria.foto);
    console.log(categoria, "categoria");
    console.log(selectcategoriamenu);
  };
  const handleClosededitCategoriamenu = () => {
    seteditcategoriamenu(false);
  };

  //funcion para editar categoria del menu
  const handleEditCategoriaMenu = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    try {
      // Obtener el UID del usuario basado en el identificador
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

      const publicidadRef = doc(
        db,
        "categoriaMenu",
        uidUser,
        "Menus",
        selectcategoriamenu.IdMenu,
        "categorias",
        selectcategoriamenu.id
      );

      // Mantener la foto existente inicialmente
      let logoURL = selectcategoriamenu.foto;

      if (fotoCategoria) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `ImgProductosmenu/${nombreEmpresa}/${fotoCategoria.name}`
        );

        // Subir la nueva imagen a Firebase Storage
        await uploadBytes(storageRef, fotoCategoria);

        // Obtener la URL de descarga de la nueva imagen
        logoURL = await getDownloadURL(storageRef); // Actualiza logoURL solo si hay una nueva foto
      }

      // Crear el objeto con los nuevos datos de la publicidad
      const updatedPublicidad = {
        nombre: nombreCategoria || selectcategoriamenu.nombre,
        foto: logoURL, // Esto ahora puede ser la foto existente o la nueva
        descripcion: descripcionCategoria || selectcategoriamenu.descripcion,
        activeCategory: categoriaActiva,
      };

      // Actualizar la publicidad en Firestore
      await updateDoc(publicidadRef, updatedPublicidad);

      console.log("Publicidad editada exitosamente en Firestore.");
      fetchCategoriaMenu();
      handleClosededitCategoriamenu();
      setAlertMessage("Categoria Actualizada con éxito");
      setShowAlert(true);
      setopenDropdownmenu(false);
    } catch (error) {
      console.error("Error al editar la publicidad:", error);
    }
  };

  //Modal para eliminar categoria de un menu
  const HandleOpenDeleteCategoriaMenu = (categoria) => {
    setdeletecategoriamenu(true);
    setselectcategoriamenudele(categoria);
    console.log(categoria, "categoria");
  };
  const HandleClosedDeleteCategoriaMenu = () => {
    setdeletecategoriamenu(false);
    setopenDropdownmenuCategorias(false);
  };

  //funcion eliminar categoria de un Menú
  const handleDeleteCategoriaMenu = async (selectcategoriamenudele) => {
    try {
      // Obtener el UID del usuario basado en el identificador
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

      const publicidadRef = doc(
        db,
        "categoriaMenu",
        uidUser,
        "Menus",
        selectcategoriamenudele.IdMenu,
        "categorias",
        selectcategoriamenudele.id
      );

      // // Eliminar la imagen de Firebase Storage, si existe
      // if (selectcategoriamenudele.foto) {
      //   const storage = getStorage();
      //   const storageRef = ref(
      //     storage,
      //     `ImgProductosmenu/${nombreEmpresa}/${selectcategoriamenudele.foto}`
      //   );

      //   await deleteObject(storageRef); // Eliminar la imagen de Firebase Storage
      //   console.log("Imagen eliminada de Firebase Storage.");
      // }

      // Eliminar la categoría de Firestore
      await deleteDoc(publicidadRef);
      console.log("Categoría eliminada exitosamente de Firestore.");

      // Actualizar la lista de categorías después de eliminar
      fetchCategoriaMenu();
      HandleClosedDeleteCategoriaMenu();
      setAlertMessage("Categoria Eliminada con éxito");
      setShowAlert(true);
      setopenDropdownmenu(false);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      <div className="my-3 mx-10 flex justify-between">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Configurar Menús
        </p>

        <button
          data-modal-target="authentication-modal"
          data-modal-toggle="authentication-modal"
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={handleopenmodalnewmenu}
        >
          Añadir Menú
        </button>
      </div>
      <Modal
        isOpen={OpenModalNewMenu}
        onClose={handleclosedmodalnewmenu}
        nombre="Añadir Nuevo Menú"
        size="auto"
      >
        <form className="space-y-4" onSubmit={handleAddNewMenu}>
          <div>
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nombre Menú
            </label>
            <input
              type="text"
              onChange={(e) => setnombreMenunew(e.target.value)}
              value={nombreMenunew}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="number"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Descripción Menú
            </label>
            <input
              type="text"
              onChange={(e) => setdescripcionMenunew(e.target.value)}
              value={descripcionMenunew}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Añadir Menú
          </button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-6">
        {/* Primer contenedor con los menús */}
        <div className=" border shadow-xs dark:bg-slate-600 flex flex-col w-auto mb-12 h-96 px-6 py-2 rounded-2xl md:col-span-1">
          <div className="flex flex-col gap-4 p-2  max-h-[500px] overflow-y-auto">
            <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-md">
              {DataMenus.map((menu, index) => {
                // Filtrar las categorías correspondientes al menú actual
                const categoriasFiltradas = DataCategorias.filter(
                  (categoria) => categoria.IdMenu === menu.IdMenu
                );

                return (
                  <li
                    key={index}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation(); // Para evitar que el click también abra el modal
                      handleMenuClick(menu.IdMenu);
                    }}
                  >
                    <div className="flex justify-end">
                      <Tooltip content="Opciones">
                        <button
                          id="dropdownMenuIconButton"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleopenDropdownmenu(menu);
                          }}
                          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 4 15"
                          >
                            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                          </svg>
                        </button>
                      </Tooltip>

                      {openDropdownmenu === menu.IdMenu && (
                        <div
                          ref={dropdownRef}
                          id="dropdownDots"
                          className="z-50 absolute mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                        >
                          <ul
                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownMenuIconButton"
                          >
                            <li>
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpeneditmodal(menu);
                                }}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                <FaRegEdit /> Editar menú
                              </a>
                            </li>
                            <Modal
                              nombre="Editar Menú"
                              isOpen={editMenu}
                              size="auto"
                              onClose={(e) => {
                                e.stopPropagation();
                                handleClosededitmodal();
                              }}
                            >
                              <form
                                className="space-y-4"
                                onSubmit={handleEditMenu}
                              >
                                <div>
                                  <label
                                    htmlFor="text"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Nombre menú
                                  </label>
                                  <input
                                    type="text"
                                    onChange={(e) =>
                                      setnombreMenunew(e.target.value)
                                    }
                                    value={nombreMenunew}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="number"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Descripción menú
                                  </label>
                                  <input
                                    type="text"
                                    onChange={(e) =>
                                      setdescripcionMenunew(e.target.value)
                                    }
                                    value={descripcionMenunew}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                  Actualizar menú
                                </button>
                              </form>
                            </Modal>
                            <li>
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  HandleopenModaldeletemenu(menu);
                                }}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                <FaRegTrashAlt /> Eliminar menú
                              </a>
                              <Modal
                                isOpen={deletemenu}
                                nombre="Eliminar Publicidad"
                                onClose={HandleclosedModaldeletemenu}
                                size="auto"
                                Fondo="auto"
                              >
                                {selectmenu && (
                                  <div className="mt-4">
                                    <p>
                                      ¿Estás seguro de que deseas eliminar el
                                      menú{" "}
                                      <span className="font-semibold">
                                        {selectmenu.nombre}
                                      </span>{" "}
                                      <span className="font-semibold"></span>?
                                    </p>

                                    <div className="flex justify-end gap-2 mt-4">
                                      <button
                                        onClick={() =>
                                          handleDeleteMenu(selectmenu)
                                        }
                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                      >
                                        Eliminar
                                      </button>
                                      <button
                                        onClick={HandleclosedModaldeletemenu}
                                        className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Modal>
                            </li>
                            <li>
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenmodalcopymenu(menu);
                                }}
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                <FaRegCopy /> Copiar ruta del menú
                              </a>
                              <Modal
                                isOpen={opencopyrutaMenu}
                                nombre="Copiar Ruta Menú"
                                onClose={handleClosedmodalcopymenu}
                                size="auto"
                                Fondo="auto"
                              >
                                {selectmenu && (
                                  <div className="mt-4">
                                    <p>
                                      <span className="font-semibold text-xl">
                                        {`${nombreEmpresa}/menu/${selectmenu.IdMenu}`}
                                      </span>{" "}
                                      <span className="font-semibold"></span>
                                    </p>

                                    <div className="flex justify-end gap-2 mt-4">
                                      <button
                                        onClick={handleCopyToClipboard}
                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                      >
                                        Copiar
                                      </button>
                                      <button
                                        onClick={handleClosedmodalcopymenu}
                                        className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Modal>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{menu.nombre}</h3>
                        <p className="text-sm text-gray-500">
                          {menu.descripcion}
                        </p>
                      </div>
                      <div className="text-right">
                        <h3 className="text-sm font-semibold">Categorías</h3>
                        <p className="text-sm text-gray-600">
                          {categoriasFiltradas.length}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Segundo contenedor con las categorías */}
        <div className="col-span-2 mb-12 border rounded-2xl p-6 bg-white flex  flex-col gap-6 max-h-[385px] overflow-y-auto">
          {selectedMenu ? (
            <div className="flex justify-end">
              <div>
                <Tooltip content="Añadir Nueva Categoria">
                  <div
                    className="bg-slate-50 cursor-pointer flex items-center gap-2 p-2 rounded-full shadow"
                    onClick={handleopenmodalnewcategoriamenu}
                  >
                    <p>Añadir Nueva Categoria</p>
                    <IoFastFoodSharp />
                  </div>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div className="hidden"></div>
          )}

          {selectedMenu ? (
            categoriasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {categoriasFiltradas.map((categoria, index) => {
                  const productosTotal = dataProductos.filter(
                    (producto) =>
                      producto.categoriaItem === categoria.IdCategoria
                  );
                  const productosCantidad = productosTotal.length;
                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();

                        handleopenmodalviewproductoscategorias(categoria);
                      }}
                      className="relative p-4 cursor-pointer bg-slate-50 shadow-lg rounded-xl"
                    >
                      {/* Botón con dropdown */}
                      <div className="flex justify-end mb-2 relative">
                        <Tooltip content="Opciones">
                          <button
                            id="dropdownMenuIconButton"
                            onClick={(e) => {
                              e.stopPropagation(); // Para evitar que el click también abra el modal
                              handleopenDropdownmenuCategorias(categoria);
                            }}
                            className="inline-flex items-center p-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                            type="button"
                          >
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 4 15"
                            >
                              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                          </button>
                        </Tooltip>

                        {/* Dropdown opciones */}
                        {openDropdownmenuCategorias ===
                          categoria.IdCategoria && (
                          <div
                            ref={dropdownRef}
                            id="dropdownDots"
                            className="z-50 absolute right-0 mt-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                          >
                            <ul
                              className="py-2 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="dropdownMenuIconButton"
                              onClick={(e) => {
                                e.stopPropagation(); // Para evitar que el click también abra el modal
                              }}
                            >
                              <li>
                                <a
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpeneditCategoriamenu(categoria);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  <FaRegEdit /> Editar Categoria
                                </a>
                                <Modal
                                  nombre="Editar Categoria"
                                  isOpen={editcategoriamenu}
                                  size="fixed"
                                  onClose={handleClosededitCategoriamenu}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div
                                    className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-6 mt-10"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="border shadow-xs dark:bg-slate-600 flex flex-col w-full justify-center md:w-auto mb-12 h-auto px-6 py-2 rounded-2xl md:col-span-1">
                                      <form
                                        className="space-y-4"
                                        onSubmit={handleEditCategoriaMenu}
                                      >
                                        <div>
                                          <label
                                            htmlFor="text"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                          >
                                            Nombre Categoria
                                          </label>
                                          <input
                                            type="text"
                                            onChange={(e) =>
                                              setnombreCategoria(e.target.value)
                                            }
                                            value={nombreCategoria}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                          />
                                        </div>
                                        <div>
                                          <label
                                            htmlFor="number"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                          >
                                            Descripción Categoria
                                          </label>
                                          <input
                                            type="text"
                                            onChange={(e) =>
                                              setdescripcionCategoria(
                                                e.target.value
                                              )
                                            }
                                            value={descripcionCategoria}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                          />
                                        </div>
                                        <div>
                                          <label
                                            htmlFor="number"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                          >
                                            Foto Categoria
                                          </label>
                                          <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            id="categoriaActiva"
                                            checked={categoriaActiva} 
                                            onChange={(e) =>
                                              setcategoriaActiva(
                                                e.target.checked
                                              )
                                            } 
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                          />
                                          <label
                                            htmlFor="categoriaActiva"
                                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                          >
                                            ¿Hacer esta categoría activa?
                                          </label>
                                        </div>

                                        <button
                                          type="submit"
                                          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                          Actualizar Categoria
                                        </button>
                                      </form>
                                    </div>
                                    <div className="col-span-2 mb-12 border rounded-2xl p-6 bg-white flex  flex-col gap-6 max-h-[385px] overflow-y-auto">
                                      {previewUrl && (
                                        <div className="">
                                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Vista previa de la imagen
                                            seleccionada:
                                          </label>
                                          <img
                                            src={previewUrl} // Muestra la imagen seleccionada
                                            alt="Vista previa"
                                            className="rounded-lg  object-contain" // Ajusta el tamaño y estilo de la imagen
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Modal>
                              </li>
                              <li>
                                <a
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    HandleOpenDeleteCategoriaMenu(categoria);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  <FaRegTrashAlt /> Eliminar Categoria
                                </a>
                              </li>
                              <Modal
                                isOpen={deletecategoriamenu}
                                nombre="Eliminar Categoria"
                                onClose={HandleClosedDeleteCategoriaMenu}
                                size="auto"
                                Fondo="auto"
                              >
                                {selectcategoriamenudele && (
                                  <div className="mt-4">
                                    <p>
                                      ¿Estás seguro de que deseas eliminar la
                                      categoria{" "}
                                      <span className="font-semibold">
                                        {selectcategoriamenudele.nombre}
                                      </span>{" "}
                                      <span className="font-semibold"></span>?
                                    </p>

                                    <div className="flex justify-end gap-2 mt-4">
                                      <button
                                        onClick={() =>
                                          handleDeleteCategoriaMenu(
                                            selectcategoriamenudele
                                          )
                                        }
                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                      >
                                        Eliminar
                                      </button>
                                      <button
                                        onClick={
                                          HandleClosedDeleteCategoriaMenu
                                        }
                                        className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Modal>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Imagen de la categoría */}
                      <img
                        src={categoria.foto}
                        alt={categoria.nombre}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />

                      {/* Información de la categoría */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {categoria.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {categoria.descripcion}
                          </p>
                        </div>

                        {/* Sección de productos */}
                        <div className="flex flex-col items-center">
                          <h3 className="text-lg font-semibold">Productos</h3>
                          <div className="flex items-center gap-4">
                            <p className="text-base bg-white rounded-full p-2 px-4 text-gray-600 text-center shadow-sm">
                              {productosCantidad}
                            </p>
                            <span className="text-sm text-gray-500">
                              Ver productos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-lg text-gray-500">Menú sin categorías</p>
            )
          ) : (
            <p className="text-lg text-gray-500">
              Selecciona un menú para ver las categorías
            </p>
          )}

          <Modal
            isOpen={modalviewproductoscategoria}
            onClose={handleclosedmodalviewproductoscategorias}
            size="fixed"
          >
            {categoriaselect && (
              <div>
                <h2 className="text-xl font-bold">
                  Productos de la categoría: {categoriaselect.nombre}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {dataProductos
                    .filter(
                      (producto) =>
                        producto.categoriaItem === categoriaselect.IdCategoria
                    )
                    .map((producto) => (
                      // Usa un único contenedor para cada producto y el atributo `key`
                      <div
                        key={producto.id}
                        className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
                      >
                        <img
                          className="object-cover  h-40 relative mx-3 mt-3 rounded-xl"
                          src={producto.foto}
                          alt={producto.nombre}
                        />
                        <span className="absolute top-0 left-0 m-2 rounded-full bg-red-400 px-2 text-center text-sm font-medium text-white">
                          Popular
                        </span>

                        <div className="mt-4 px-5 pb-5">
                          <div className="flex gap-4 justify-between">
                            <p>
                              <h5 className="text-xl tracking-tight text-slate-900">
                                {producto.nombre}
                              </h5>
                            </p>
                            <div className="flex justify-end items-center space-x-1">
                              {Array.from({ length: 1 }, (_, index) => (
                                <svg
                                  key={index}
                                  aria-hidden="true"
                                  className="h-5 w-5 text-yellow-300"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d={
                                      index <
                                      Math.floor(Number(producto.calificación))
                                        ? "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        : ""
                                    }
                                  />
                                </svg>
                              ))}
                              <span className="ml-2 rounded bg-yellow-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                {Number(producto.calificación).toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <p>
                            <h5 className="text-base tracking-tight text-slate-400">
                              {producto.descripcion}
                            </h5>
                          </p>

                          <div className="mt-2 mb-5 flex items-start ">
                            <p>
                              <span className="text-base font-bold text-slate-900">
                                {producto.variacion
                                  ? producto.variacion.map((valor, id) => (
                                      <div
                                        className="flex  items-end justify-between gap-4"
                                        key={id}
                                      >
                                        <p className=" w-32  border-r-2 border-gray-400 ">
                                          {valor.descripcion}
                                        </p>
                                        <p>
                                          {Number(valor.precio).toLocaleString(
                                            "es-CO",
                                            {
                                              style: "currency",
                                              currency: "COP",
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 0,
                                            }
                                          )}
                                        </p>
                                      </div>
                                    ))
                                  : `${Number(producto.valor).toLocaleString(
                                      "es-CO",
                                      {
                                        style: "currency",
                                        currency: "COP",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }
                                    )}`}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Modal>
        </div>

        <Modal
          isOpen={OpenNewCategoria}
          onClose={handleclosedmodalnewcategoriamenu}
          size="auto"
          nombre="Añadir nueva categoria"
        >
          <form className="space-y-4" onSubmit={handleAddNewCategoriaMenu}>
            <div>
              <label
                htmlFor="nombreCategoria"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nombre Categoria
              </label>
              <input
                type="text"
                id="nombreCategoria"
                onChange={(e) => setnombreCategoria(e.target.value)}
                value={nombreCategoria}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="descripcionCategoria"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Descripción Categoria
              </label>
              <input
                type="text"
                id="descripcionCategoria"
                onChange={(e) => setdescripcionCategoria(e.target.value)}
                value={descripcionCategoria}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="fotoCategoria"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Foto Categoria
              </label>
              <input
                type="file"
                id="fotoCategoria"
                onChange={handleImageChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="categoriaActiva"
                onChange={(e) => setcategoriaActiva(e.target.checked)}
                checked={categoriaActiva}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="categoriaActiva"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                ¿Hacer esta categoría activa?
              </label>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Añadir Categoria
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}

export default CategoriasMenu;
