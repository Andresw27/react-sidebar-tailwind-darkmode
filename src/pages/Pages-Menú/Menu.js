import { Link } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { Context } from "../../components/AppContext";
// import OurMenuFilter from "../elements/OurMenuFilter";
import BannerFondo from "../../assets/f.webp";
import Logo from "../../assets/logo.png";
import Modal from "../../components/ModalMenu";
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Carrito from "../../components/CarritoMenu";
import { useSelector } from "react-redux";
import AlertMenu from "../../components/AlertMenu"; // Importa el componente de alerta
import LogoJeicy from "../../assets/jeicy.png";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase-config";

const MenuStyle3 = () => {
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState("");
  const [categoriasData, setcategoriasData] = useState([]);
  const [dataProductos, setDataProductos] = useState([]);
  const { setShowCategeryFilter } = useContext(Context);
  const [OpenModalDetalleProducto, setOpenModalDetalleProducto] = useState("");
  const [selectProductoDetalle, setselectProductoDetalle] = useState(null);
  const [scroll, setScroll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const { IdMenu, nombreEmpresa } = useParams(); // Obtenemos el identificador desde la URL
  const [showMenuLoading, setShowMenuLoading] = useState(false); // Loading secundario
  const [error, setError] = useState(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true); // Estado de carga de categorías
  const [loadingProductos, setLoadingProductos] = useState(true); // Estado de carga de productos
  const [minimumLoadingTime, setMinimumLoadingTime] = useState(true); // Para mantener el loading 3 segundos
  const [identificador, setIdentificador] = useState(null); // Para guardar el identificador del usuario
  const [menuData, setMenuData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [headerSidebar, setHeaderSidebar] = useState(false); // Estado del sidebar
  const [enableDelivery, setEnabreDelivery] = useState(false);
  const [carrito, setcarrito] = useState([]);
  const [selectActiveCategory, setselectActiveCategory] = useState("");
  const urlActual = `${nombreEmpresa}/menu/${IdMenu}`;
  const url = window.location.pathname;

  const [categoriasAdicionesProducto, setCategoriasAdicionesProducto] =
    useState([
      {
        nombre: "Elige Acompañamiento Para Tu Plato, Requerido",
        items: [
          { nombre: "Casco de papas" },
          { nombre: "Casco de yuca" },
          { nombre: "Papas Francesas" },
        ],
      },
      {
        nombre: "Elije tu bebida",
        items: [
          { nombre: "Coca cola personal", precio: 10000 },
          { nombre: "Coca cola de yuca", precio: 7000 },
          { nombre: "Coca cola Francesas", precio: 6000 },
        ],
      },
      {
        nombre: "Salsa Adicional",
        items: [
          { nombre: "Tomate", precio: 2000 },
          { nombre: "Bbq", precio: 2000 },
          { nombre: "Chili dulce", precio: 2000 },
        ],
      },
    ]);

  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (categoriasData.length > 0) {
      const activeCat = categoriasData.find(
        (categoria) => categoria.activeCategory === true
      );

      if (activeCat) {
        setActiveCategory(activeCat.IdCategoria); // Establece la categoría activa
      } else {
      }
    }
  }, [categoriasData]); // Se ejecuta cuando categoriasData cambia

  // Buscar identificador por nombreEmpresa
  useEffect(() => {
    const fetchIdentificador = async () => {
      try {
        const q = query(
          collection(db, "usuarios"),
          where("nombreEmpresa", "==", nombreEmpresa)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const userData = firstDoc.data();
          setIdentificador(firstDoc.id); // Guardar el identificador encontrado
        } else {
          setError("No se encontró ninguna empresa con ese nombre.");
        }
      } catch (error) {
        console.error("Error al buscar el identificador:", error);
        setError("Hubo un error al obtener el identificador.");
      }
    };

    if (nombreEmpresa) {
      fetchIdentificador();
    }
  }, [nombreEmpresa]);

  // Function to reset quantity when a new product is selected
  const actualizarCantidadProducto = () => {
    if (selectProductoDetalle) {
      setQuantity(1); // Reset quantity to 1
    }
  };

  // Use effect to watch for changes in selectProductoDetalle
  useEffect(() => {
    if (selectProductoDetalle) {
      actualizarCantidadProducto(); // Call the function to reset quantity
    }
  }, [selectProductoDetalle]);

  // Runs every time selectProductoDetalle changes
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!identificador) return; // Esperamos tener el identificador

      try {
        // Accedemos a la colección 'landing' usando el identificador obtenido
        const menuCollectionRef = collection(
          db,
          "config",
          identificador,
          "landing"
        );

        const menuDocsSnap = await getDocs(menuCollectionRef);

        if (!menuDocsSnap.empty) {
          // Si solo hay un documento, obtenemos el primero
          const firstDoc = menuDocsSnap.docs[0];
          const data = firstDoc.data();
          // if (data.botones.href==url){
          data.botones.forEach((element) => {
            if (urlActual == element.href && element.domicilio === true) {
              setEnabreDelivery(true);
            }
          });
          // }

          setMenuData(data);
          // console.log(data);

          // console.log("tipo Domicilio", typeof firstDoc.data().domicilio);
          // console.log(firstDoc.data())

          // Simulamos un pequeño delay para mostrar el loading del logo del menú
          setTimeout(() => {
            setShowMenuLoading(true);
          }, 1000); // Puedes ajustar el tiempo de retraso
        } else {
          setError(
            "No se encontraron documentos en la subcolección 'landing'."
          );
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("Hubo un error al obtener los datos del menú.");
      } finally {
        setLoading(false); // El loading inicial solo se detiene cuando obtenemos los datos o si ocurre un error
      }
    };

    // Condición para ejecutar fetchMenuData solo si identificador existe
    if (identificador) {
      fetchMenuData();
    }
  }, [identificador]);

  // Cargar categorías usando el identificador
  useEffect(() => {
    const fetchCategoriasData = async () => {
      setLoadingCategorias(true);
      if (!identificador) return;

      try {
        const categoriaMenuDocRef = doc(db, "categoriaMenu", identificador);
        const menuDocRef = doc(categoriaMenuDocRef, "Menus", IdMenu);
        const categoriasCollectionRef = collection(menuDocRef, "categorias");
        const categoriasDocsSnap = await getDocs(categoriasCollectionRef);

        if (!categoriasDocsSnap.empty) {
          const categoriasData = categoriasDocsSnap.docs.map((doc) =>
            doc.data()
          );
          setcategoriasData(categoriasData);
          setLoadingCategorias(false);
        } else {
          setError("No se encontraron categorías.");
          setLoadingCategorias(false);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setError("Hubo un error al obtener las categorías.");
        setLoadingCategorias(false);
      }
    };

    if (identificador) {
      fetchCategoriasData();
    }
  }, [identificador, IdMenu]);

  // Nombre del caché y URL del caché
  const cacheName = "productosCache";
  const cacheUrl = `/productos-${identificador}`;

  const fetchProductos = async () => {
    try {
      if (!identificador) return;
      // Siempre se consulta a la base de datos para obtener los productos más recientes
      const userDocRef = collection(
        db,
        "productos",
        identificador,
        "productos"
      );
      const snapshot = await getDocs(userDocRef);
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataProductos(productos); // Actualizamos el estado con los productos más recientes

      // Abre el caché y actualiza los productos en caché
      const cache = await caches.open(cacheName);
      await cache.put(cacheUrl, new Response(JSON.stringify(productos)));

      // Oculta el loading de productos si tienes uno
      setLoadingProductos(false);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("Hubo un error al cargar los productos.");
      setLoadingProductos(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [identificador]);

  //añadir al carrito
  const agregarAlCarrito = (producto) => {
    const existingProduct = carrito.find(
      (item) => item.nombre === producto.nombre
    );

    if (existingProduct) {
      // Si el producto ya está en el carrito, suma la cantidad
      setcarrito(
        carrito.map((item) =>
          item.nombre === producto.nombre
            ? { ...item, quantity: item.quantity + producto.quantity }
            : item
        )
      );
      handleClosedModaldetalleProducto();
      setAlertMessage("Producto Agregado ");
      setShowAlert(true);
    } else {
      // Si no está en el carrito, lo agrega
      setcarrito([...carrito, { ...producto, quantity: producto.quantity }]);
      handleClosedModaldetalleProducto();
      setAlertMessage("Producto Agregado");
      setShowAlert(true);
    }
  };

  const { foto, nombre, valor, descripcion, variacion, calificación } =
    selectProductoDetalle || {};

  const isLoading = loadingCategorias || loadingProductos || minimumLoadingTime;

  // Mostrar el loading hasta que ambas cargas hayan terminado y hayan pasado al menos 3 segundos
  useEffect(() => {
    if (!loadingCategorias && !loadingProductos && !minimumLoadingTime) {
      // Ocultar el loading si ambas cargas han finalizado y han pasado los 3 segundos
    }
  }, [loadingCategorias, loadingProductos, minimumLoadingTime]);

  // Mostrar el loading mínimo de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingTime(false); // Termina el tiempo mínimo de 3 segundos
    }, 3000); // 3000 ms = 3 segundos

    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, []);

  // Mostrar el popup automáticamente cuando el componente cargue
  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenModaldetalleProducto = (producto, menu) => {
    setOpenModalDetalleProducto(true);
    setselectProductoDetalle(producto);
    document.body.style.overflow = "hidden";
  };

  const handleClosedModaldetalleProducto = () => {
    setOpenModalDetalleProducto(false);
    document.body.style.overflow = "auto";
  };

  const filteredProducts = dataProductos.filter(
    (producto) =>
      producto.categoriaItem === activeCategory && producto.estado === "Activo"
  );

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const scrollHandler = () => {
    if (window.scrollY > 90) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  // Renderizado del loading
  if (isLoading) {
    return (
      <>
        {menuData && menuData.botones && (
     <div
     style={{
       backgroundColor: menuData.botones[0].backgroundColor,
       color: menuData.botones[0].textColor,
     }}
     className="fixed inset-0 z-50 flex items-center justify-center flex-col space-y-4 p-6"
   >
     {/* Logo principal */}
     <div className="mb-2">
       <img
         src={menuData.logo}
         className="h-[180px] mb-4"
         alt="Menu Logo"
       />
     </div>

     {/* Texto de carga con puntos animados */}
     <div className="text-white text-[20px] font-semibold tracking-wide mb-2">
       Cargando <span className="dot-ellipsis">.</span>
     </div>

     {/* Texto de desarrollador */}
     <div
      style={{
        color: menuData.botones[0].textColor,
      }}
     className="text-[10px] font-medium uppercase tracking-wider mb-2">
       Desarrollado por:
     </div>

     {/* Logo del desarrollador con efecto hover */}
     <img
       src={LogoJeicy}
       className="h-[45px] opacity-80 hover:opacity-100 transition duration-300 ease-in-out"
       alt="Developer Logo"
     />
   </div>
        )}
      </>
    );
  }

  const removeFromCart = (productName) => {
    setcarrito(carrito.filter((item) => item.nombre !== productName));
  };

  const updateCartQuantity = (productName, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productName);
    } else {
      setcarrito(
        carrito.map((producto) =>
          producto.nombre === productName
            ? { ...producto, quantity: quantity }
            : producto
        )
      );
    }
  };

  return (
    <div
      className="dark:text-white top-0 left-0 w-full bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-center "
      style={{
        backgroundImage: `url(${menuData.fondo})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        height: "100%",
      }}
    >
      {showAlert && (
        <AlertMenu message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      <Popup isVisible={showPopup} onClose={handleClosePopup} />

      <Header />

      <div className="mt-11 md:mt-[0px]">
        <section className="content-inner-1 lg:pt-[100px] sm:pt-[70px] pt-[50px] pb-40  relative overflow-hidden w-full">
          <div className="grid grid-cols-1 md:grid-cols-1 ">
            {/* Row Container */}
            <div
              className={` justify-center  ${
                scroll
                  ? " justify-center lg:static fixed top-0 left-0 w-full  z-50 "
                  : ""
              }`}
            >
              {/* Category Filter Section */}
              <div className="w-full flex justify-center items-center">
                <div className="site-filters w-full flex flex-col items-center">
                  <div className="flex items-center justify-between w-full bg-white  p-3 md:p-4 shadow-md gap-2 md:gap-4">
                    {/* Scroll Left Button */}
                    <button
                      onClick={scrollLeft}
                      aria-label="Scroll Left"
                      className=" text-black text-2xl transition-colors duration-300 focus:outline-none"
                    >
                      <IoIosArrowBack />
                    </button>

                    {/* Category List */}
                    <ul
                      className="flex  overflow-x-auto snap-x snap-mandatory items-center  scrollbar-hide space-x-2 md:space-x-6 px-2 md:px-4 w-full"
                      ref={scrollRef}
                    >
                      {categoriasData
                        .filter((categoria) => {
                          // Filter the products to check if the category has active products
                          const productosFiltrados = dataProductos.filter(
                            (producto) =>
                              producto.categoriaItem === categoria.IdCategoria
                          );
                          // Only keep the category if it has active products
                          return productosFiltrados.length > 0;
                        })
                        .map((categoria) => {
                          const productosFiltrados = dataProductos.filter(
                            (producto) =>
                              producto.categoriaItem === categoria.IdCategoria
                          );

                          return (
                            <li
                              key={categoria.IdCategoria}
                              className={`cursor-pointer  flex-shrink-0 snap-start  ease-in-out 
                      ${
                        activeCategory === categoria.IdCategoria
                          ? "border-b-[1px]  border-black text-[#000000] font-bold"
                          : "text-black hover:text-gray-800 font-medium"
                      }`}
                              onClick={() =>
                                setActiveCategory(categoria.IdCategoria)
                              }
                            >
                              <Link
                                to="#"
                                className="flex items-center  text-base justify-center px-4 py-2 md:px-6 md:py-3  md:text-md "
                              >
                                {categoria.nombre}
                              </Link>
                            </li>
                          );
                        })}
                    </ul>

                    {/* Scroll Right Button */}
                    <button
                      onClick={scrollRight}
                      aria-label="Scroll Right"
                      className=" text-black text-2xl transition-colors duration-300 focus:outline-none"
                    >
                      <IoIosArrowForward />
                    </button>
                  </div>
                  {/* Filter Count Section */}
                  <div className="w-full lg:text-right flex items-center  justify-end gap-1 mb-[2px]">
                    <div
                      className="bg-red-800  w-full"
                      style={{
                        backgroundColor:
                          menuData.botones[0]?.backgroundColor || "bg-red-800", // Usar el backgroundColor del primer botón o un color por defecto
                      }}
                    >
                      {categoriasData.map((categoria) => {
                        const productosFiltrados = dataProductos.filter(
                          (producto) =>
                            producto.categoriaItem === categoria.IdCategoria &&
                            producto.estado === "Activo"
                        );

                        return (
                          activeCategory === categoria.IdCategoria && (
                            <p
                              key={categoria.IdCategoria}
                              className="text-center text-white text-base"
                            >
                              {productosFiltrados.length} productos disponibles
                            </p>
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Images Section */}
            <div>
              {categoriasData.map((categoria) =>
                activeCategory === categoria.IdCategoria ? (
                  <div className="md:px-40 w-full h-32 md:h-64  ">
                    {categoria.foto ? (
                      <img
                        src={categoria.foto}
                        className="w-full h-full  object-cover"
                        alt={categoria.nombre}
                      />
                    ) : (
                      <span className="text-gray-500">
                        Imagen no disponible
                      </span>
                    )}
                  </div>
                ) : null
              )}
            </div>

            {/* Product Display Section */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mt-4 md:px-40">
              {filteredProducts.length > 0
                ? filteredProducts.map(
                    (
                      {
                        foto,
                        nombre,
                        valor,
                        descripcion,
                        variacion,
                        calificación,
                      },
                      index
                    ) => (
                      <div
                        className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                        key={index} // Use a unique property like 'name' or a unique 'id'
                      >
                        <div
                          onClick={() =>
                            handleOpenModaldetalleProducto({
                              foto,
                              nombre,
                              valor,
                              descripcion,
                              variacion,
                              calificación,
                            })
                          }
                          className="cursor-pointer"
                        >
                          <div className="relative w-full md:h-full h-[150px] overflow-hidden rounded-t-lg aspect-w-1 aspect-h-1">
                            <img
                              src={foto}
                              alt={nombre}
                              className="object-cover w-full h-full rounded-t-lg"
                            />
                            {/* <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs font-semibold py-1 px-3 rounded-br-lg uppercase z-10">
                              Top Seller
                            </div> */}
                            <div className="absolute bottom-2 right-2 bg-white text-gray-800 rounded-md text-sm font-medium px-2 py-1 shadow-md flex items-center">
                              <FaStar className="fa-solid fa-star text-orange-500 mr-1" />
                              {calificación}
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800 truncate mb-1">
                              {nombre}
                            </h3>
                            <div className="md:h-[80px] h-[70px]">
                              <p className="text-xs text-gray-600 mb-3  truncate-3-lines">
                                {descripcion}
                              </p>
                            </div>

                            {variacion ? (
                              variacion.map((varItem) => (
                                <div
                                  className="flex justify-between items-center mb-2"
                                  key={varItem.id}
                                >
                                  {/* Use a unique key for each variacion */}
                                  <p className="text-sm text-gray-700 font-medium truncate">
                                    {varItem.descripcion}
                                  </p>
                                  <p className="text-base font-bold text-gray-900">
                                    {Number(varItem.precio).toLocaleString(
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
                            ) : (
                              <p className="text-base font-bold text-gray-900">
                                {Number(valor).toLocaleString("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                              </p>
                            )}
                          </div>

                          <div className="p-4 border-t border-gray-100 bg-gray-50">
                            {menuData.botones.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  handleOpenModaldetalleProducto({
                                    foto,
                                    nombre,
                                    valor,
                                    descripcion,
                                    variacion,
                                    calificación,
                                  });
                                }}
                                className="w-full text-white text-sm font-semibold py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
                                style={{
                                  backgroundColor:
                                    menuData.botones[0].backgroundColor, // Usar el primer botón o uno específico
                                  color: menuData.botones[0].textColor,
                                }}
                              >
                                {enableDelivery === true ? (
                                  <>
                                    Agregar{" "}
                                    {Number(valor).toLocaleString("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    })}
                                  </>
                                ) : (
                                  <p>Ver Detalles</p>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )
                : // Placeholder to maintain the space of empty products
                  [...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg "
                    >
                      <div className="relative overflow-hidden rounded-t-lg aspect-w-1 aspect-h-1"></div>
                      <div className="p-4">
                        <div className="h-6  rounded-md mb-2"></div>
                        <div className="h-4  rounded-md"></div>
                      </div>
                      <div className="p-4 "></div>
                    </div>
                  ))}
            </div>
          </div>
          {enableDelivery === true ? (
            <Modal
              isOpen={OpenModalDetalleProducto}
              onClose={handleClosedModaldetalleProducto}
              nombre="Detalle Producto"
              size="auto md:fixed"
            >
              {selectProductoDetalle && (
                <div className="p-1 rounded-lg h-[485px] overflow-y-auto grid grid-cols-1 md:grid-cols-4 gap-1">
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="relative h-full p-3 overflow-hidden rounded-lg shadow-md">
                      <img
                        className="h-full w-full object-cover rounded-md"
                        src={selectProductoDetalle.foto}
                        alt={selectProductoDetalle.nombre}
                      />
                      {/* <ul className="absolute top-0 left-0">
                        <li className="bg-orange-500 text-white px-2 py-1 rounded-tr-lg text-xs font-semibold">
                          Popular
                        </li>
                      </ul> */}
                      <div className="absolute bottom-4 right-4 bg-white text-gray-900 px-2 py-1 rounded-lg shadow-md flex items-center">
                        <FaStar className="text-orange-500 mr-1" />
                        <span className="font-medium text-sm">
                          {selectProductoDetalle.calificación}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-1 col-span-2 rounded-lg shadow-md">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        {selectProductoDetalle.nombre}
                      </h2>
                      <p className="text-white text-sm mb-4">
                        {selectProductoDetalle.descripcion}
                      </p>
                    </div>

                    <div className="mt-0 bg-[#32383e] py-2 rounded-md px-4 h-[350px] overflow-y-auto">
                      {categoriasAdicionesProducto.map(
                        (categoriaA, categoriaIndex) => (
                          <div key={categoriaIndex} className="mb-6">
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {categoriaA.nombre}
                            </h3>
                            {categoriaA.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex justify-between items-center py-2 border-b border-gray-700"
                              >
                                <span className="text-white">
                                  {item.nombre}
                                </span>
                                <div className="flex items-center">
                                  {item.precio && (
                                    <span className="text-white font-semibold mr-4">
                                      {Number(item.precio).toLocaleString(
                                        "es-CO",
                                        {
                                          style: "currency",
                                          currency: "COP",
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0,
                                        }
                                      )}
                                    </span>
                                  )}
                                  <input
                                    type="checkbox"
                                    value={item.nombre}
                                    id={`item-${categoriaIndex}-${itemIndex}`}
                                    className="form-checkbox h-5 w-5 text-orange-500"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Instrucciones Adiciónales
                      </h3>
                      <input
                        type="text"
                        placeholder="Ingresa algunas sugerencias "
                        className=" text-white w-full rounded-md py-10 bg-gray-800 "
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectProductoDetalle && (
                <div className="bg-[#32383e] flex fixed w-full p-2 rounded-sm right-0 left-0 bottom-0">
                  <ul className="detail-list flex justify-end gap-2 w-full">
                    <div className="input-group mt-[5px] flex flex-wrap items-stretch h-[31px] relative w-[105px] min-w-[105px]">
                      <input
                        type="number"
                        step="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Number(e.target.value) || 0)
                        } // Actualiza el estado con el valor del input
                        className="quantity-field"
                      />
                      <span className="flex justify-between p-[2px] absolute w-full">
                        <input
                          type="button"
                          value="-"
                          className="button-minus"
                          data-field="quantity"
                          onClick={() => {
                            const newQuantity = quantity - 1;
                            setQuantity(newQuantity >= 0 ? newQuantity : 0); // No permitir cantidades negativas
                          }}
                        />
                        <input
                          type="button"
                          value="+"
                          onClick={() => setQuantity(quantity + 1)} // Aumentar cantidad
                          className="button-plus"
                          data-field="quantity"
                        />
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        agregarAlCarrito({
                          foto,
                          nombre,
                          valor,
                          descripcion,
                          variacion,
                          calificación,
                          quantity: quantity,
                        });
                      }}
                      className="w-[220px] bg-red-600 text-white text-base font-semibold py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
                    >
                      Agregar
                      {Number(selectProductoDetalle.valor).toLocaleString(
                        "es-CO",
                        {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )}
                    </button>
                  </ul>
                </div>
              )}
            </Modal>
          ) : (
            <Modal
              isOpen={OpenModalDetalleProducto}
              onClose={handleClosedModaldetalleProducto}
              nombre="Detalle Producto"
              size="auto md:fixed"
            >
              {selectProductoDetalle && (
                <div className=" overflow-y-auto">
                  <div className="ddz-media bg-white  relative overflow-hidden rounded-lg">
                    <img
                      className="h-full w-full object-cover"
                      src={selectProductoDetalle.foto}
                      alt="Producto"
                    />
                    <div className="dz-meta">
                      <ul>
                        {/* <li className="absolute top-0 bg-[#FE9F10] left-0 text-white rounded-ee-[10px] uppercase py-[4px] px-2.5 font-semibold text-xs leading-[18px] z-[2]">
                          Popular
                        </li> */}
                        <li className="rating absolute bottom-[20px] right-[20px] flex items-center bg-white text-[#222222] rounded-md text-sm shadow-lg font-medium py-1 px-[10px] mr-0">
                          <FaStar className="fa-solid fa-star text-orange-500 mr-1" />
                          {selectProductoDetalle.calificación}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-2">
                    <p className="text-xl font-medium text-white">
                      {selectProductoDetalle.nombre}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="text-sm font-medium text-white">
                      {selectProductoDetalle.descripcion}
                    </p>
                  </div>
                  <div className="px-2 mt-6">
                    {selectProductoDetalle.variacion ? (
                      selectProductoDetalle.variacion.map((variacion) => (
                        <div
                          className="flex gap-4 items-center"
                          key={variacion.id}
                        >
                          {" "}
                          {/* Asegúrate de que `id` sea único */}
                          <div className="text-center w-24 flex justify-between">
                            <p className="mb-[10px] font-semibold truncate text-left xs:text-center sm:text-center text-white text-[15px]">
                              {variacion.descripcion}
                            </p>
                            <div>
                              <p className="text-xl">|</p>
                            </div>
                          </div>
                          <div className="text-center flex items-center">
                            <p className="mb-[10px] font-semibold text-left xs:text-center sm:text-center text-white text-base">
                              {Number(variacion.precio).toLocaleString(
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
                        </div>
                      ))
                    ) : (
                      <p className="mb-[10px] font-semibold text-left xs:text-center sm:text-center text-white text-xl">
                        {Number(selectProductoDetalle.valor).toLocaleString(
                          "es-CO",
                          {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Modal>
          )}

          {menuData.botones.map((boton) =>
            enableDelivery === true ? (
              <div>
                {/* Renderizamos el botón con el atributo domicilio: true */}
                <button
                  onClick={() => {
                    setHeaderSidebar(!headerSidebar);
                  }}
                  className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                  style={{ zIndex: 900 }} // Aseguramos que esté sobre el contenido
                >
                  <FiShoppingBag size={31} />

                  {/* Círculo de notificación */}
                  <div
                    className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full"
                    style={{
                      top: "50%",
                      right: "-5px",
                      transform: "translateY(50%)",
                    }} // Mantiene el círculo dentro del botón
                  >
                    {carrito.length}
                  </div>
                </button>
              </div>
            ) : null
          )}

          {headerSidebar && (
            <div
              className="fixed top-0 right-0 w-full h-full bg-black bg-opacity-50 z-[900]"
              onClick={() => setHeaderSidebar(false)} // Cierra el sidebar si se hace clic en el fondo
            ></div>
          )}

          <div
            className={`header-sidebar fixed top-0 right-0  bg-white w-[100%] md:w-[370px] h-full shadow-lg z-[1000] transform duration-300 ${
              headerSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="sidebar-content flex flex-col gap-5 min-h-screen px-5 bg-black p-4">
              {/* Contenido del sidebar */}
              <div className="  flex justify-between items-center gap-20 p-0 z-10">
                <p className="text-white text-xl">Carrito</p>
                <button
                  onClick={() => setHeaderSidebar(false)}
                  className="text-[40px] text-white"
                >
                  <IoMdClose />
                </button>
              </div>

              <div>
                <Carrito carrito={carrito} setcarrito={setcarrito} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuStyle3;
