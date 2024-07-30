import React, { useState, useEffect,useContext } from "react";
import Layout from "../components/Layout";
import { BiBriefcaseAlt } from "react-icons/bi";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";
import { Tooltip } from "@material-tailwind/react";
import { FaRegEdit } from "react-icons/fa";
import { IoFilter,IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";

import { FaFileInvoice } from "react-icons/fa";
import Modal from "../components/Modal";
import Carrito from "../components/Carrito";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Alert from "../components/Alert";
import { UserContext } from "../UserContext"; // Asegúrate de ajustar la ruta correcta

// import notificationSound from '../assets/Npedido.mp3'
const Home = ({ totalValue }) => {
  const [dataOrder, setDataOrder] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(3);
  const [valorTotal, setValorTotal] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    estado: null,
  });
  const [openFilter, setOpenFilter] = useState();
 const [searchVisible, setSearchVisible] = useState(false);
 const user = useContext(UserContext);



  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleCloseClick = () => {
    setSearchTerm("");
    setSearchVisible(false);
  };
  const openFilterButton = () => setOpenFilter(true);
  const CloseFilterButton = () => setOpenFilter(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/pedidos/${user.identificador}`
      );
      const data = await response.json();
      setValorTotal(data.pedidos.valor);
      setDataOrder(data.pedidos);
      console.log("la data esssssddddddddds", data.pedidos);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //NUEVO PEDIDO
  // useEffect(() => {
  //   if (previousOrders.length < dataOrder.length) {
  //     playNotificationSound();
  //     alert('¡Nuevo pedido recibido!');
  //   }

  //   setPreviousOrders(dataOrder);
  // }, [dataOrder]);

  // const playNotificationSound = () => {
  //   const audio = new Audio(notificationSound);
  //   audio.play();
  // };

  const getTrClasses = (estado) => {
    switch (estado) {
      case "Aceptado":
        return "bg-blue-50 ";
      case "Entregado":
        return "bg-green-100 ";
      case "Distribucion":
        return "bg-yellow-50  ";
      case "Solicitado":
        return "bg-red-50  ";
      default:
        return "bg-gray-100";
    }
  };
  const [editOrderId, setEditOrderId] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({});

  // Función para manejar el doble clic en una celda
  const handleDoubleClick = (id) => {
    setEditOrderId(id); // Establece el ID de la orden que se está editando
  };
  const handleChange = (e, key) => {
    const newDataOrder = [...dataOrder];
    const orderIndex = newDataOrder.findIndex(
      (order) => order.id === editOrderId
    );
    if (orderIndex !== -1) {
      newDataOrder[orderIndex][key] = e.target.value;
      setDataOrder(newDataOrder);
    }
  };

  const handleChangeselect = async (id, value) => {
    const newDataOrder = [...dataOrder];
    const orderIndex = newDataOrder.findIndex((order) => order.id === id);
    if (orderIndex !== -1) {
      newDataOrder[orderIndex].estado = value;
      setDataOrder(newDataOrder);

      // Obtener el id de la orden
      const orderId = newDataOrder[orderIndex].id;

      // Persistir los cambios en el servidor
      try {
        const response = await fetch(
          `https://us-central1-jeicydelivery.cloudfunctions.net/app/pedido/${user.identificador}/${orderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDataOrder[orderIndex]),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar la orden en el servidor");
        }
        setAlertMessage("Estado actualizado con éxito");
        setShowAlert(true);
      } catch (error) {
        console.error("Error:", error);
        // Manejar el error (posiblemente revertir el cambio local)
      }
    }
  };

  // Función para manejar el blur (cuando se pierde el foco) del input de edición
  const handleBlur = async () => {
    const newDataOrder = [...dataOrder];
    const orderIndex = newDataOrder.findIndex(
      (order) => order.id === editOrderId
    );
    if (orderIndex !== -1) {
      const orderId = newDataOrder[orderIndex].id;

      try {
        const response = await fetch(
          `https://us-central1-jeicydelivery.cloudfunctions.net/app/pedido/${user.identificador}/${orderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newDataOrder[orderIndex]),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar la orden en el servidor");
        } else {
          setAlertMessage("Información actuadlizada con éxito");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Error:", error);
        // Manejar el error (posiblemente revertir el cambio local)
      }
    }
    setEditOrderId(null); // Opcional: Limpiar el estado de edición
  };

  // Añadir un efecto para manejar las teclas "Enter" y "Escape" globalmente
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      handleBlur();
    }
  };

  const handleEdit = (id) => {
    const orderToEdit = dataOrder.find((order) => order.id === id);
    if (orderToEdit) {
      setCurrentOrder({ ...orderToEdit });
      setEditOrderId(id);
    }
  };
  //formatear fecha que recibe de la data de la api
  const formatDate = (date) => {
    if (typeof date === "string") {
      return date; // If the date is already a string, return it as is
    }
    if (typeof date === "object" && date._seconds) {
      return new Date(date._seconds * 1000).toLocaleDateString();
    }
    return ""; // Return an empty string if the date is in an unexpected format
  };
  //obtener total de pedidos
  const totalPedidos = dataOrder.reduce((total, order) => total + 1, 0);
  //obtener total pedidos entregados
  const totalPedidosEntregados = dataOrder.filter(
    (order) => order.estado === "Entregado"
  ).length;

  //obtener total pedidos pendientes
  const totalPedidosPendientes = dataOrder.filter(
    (order) =>
      order.estado === "Solicitado" ||
      order.estado === "Distribucion" ||
      order.estado === "Aceptado"
  ).length;

  //Generador de fatura pdf
  const generarFactura = (order) => {
    const doc = new jsPDF("p", "mm", "a4"); // Tamaño A4 en milímetros
    const pageWidth = doc.internal.pageSize.getWidth();

    // Establecer márgenes y posiciones de inicio
    const marginX = 14;
    let currentY = 20;

    // Encabezado
    doc.setFontSize(18);
    doc.text("Jeicy Developers", pageWidth / 2, currentY, { align: "center" });

    doc.setFontSize(12);
    currentY += 10;
    doc.text("Dirección: Calle torice 123", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 6;
    doc.text("Teléfono: +123456789", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 6;
    doc.text("Email: contacto@jeicyrestaurant.com", pageWidth / 2, currentY, {
      align: "center",
    });

    // Número de factura
    doc.setFontSize(14);
    currentY += 14;
    doc.text(`Factura # ${order.id}`, pageWidth / 2, currentY, {
      align: "center",
    });

    // Información del Pedido
    doc.setFontSize(12);
    currentY += 14;
    doc.text(`Fecha: ${formatDate(order.fecha)}`, marginX, currentY);
    currentY += 6;
    doc.text(`Método de Pago: ${order.metodoPago}`, marginX, currentY);
    currentY += 6;
    doc.text(`Cliente: ${order.nombre}`, marginX, currentY);
    currentY += 6;
    doc.text(`Número de Contacto: ${order.numeroContacto}`, marginX, currentY);

    // Tabla de Productos
    const columns = ["Producto", "Cantidad", "Precio Unitario", "Total"];
    const data = order.carrito.map((producto) => [
      producto.producto,
      producto.cantidad,
      `$${producto.valorp}`,
      `$${(producto.cantidad * producto.valorp).toFixed(2)}`,
    ]);

    currentY += 10;
    doc.autoTable({
      startY: currentY,
      head: [columns],
      body: data,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 12, halign: "center" },
    });

    // Calculando el total de la factura
    const totalFactura = data.reduce(
      (total, row) => total + parseFloat(row[3].substring(1)),
      0
    );

    // Total
    currentY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(14);
    doc.text(
      `Total: $${totalFactura.toFixed(2)}`,
      pageWidth - marginX,
      currentY,
      { align: "right" }
    );

    // Pie de Página
    currentY += 20;
    doc.setFontSize(10);
    doc.text("Gracias por su compra!", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 6;
    doc.text("Visítanos en: www.jeicyrestaurant.com", pageWidth / 2, currentY, {
      align: "center",
    });

    // Guardar PDF
    doc.save(`factura_${order.nombre}.pdf`);
  };

  //Buscador por filtro
  const filteredOrder = dataOrder.filter((product) => {
    const matchesSearchTerm =
      (product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.numeroWP?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.numeroContacto
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.puntoReferencia
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.valor
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      (product.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    const matchesFilters = selectedFilters.estado
      ? product.estado === selectedFilters.estado
      : true;

    return matchesSearchTerm && matchesFilters;
  });

  //filtrar por estado
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };
  const handleClearAndCloseFilters = () => {
    setSelectedFilters({ estado: null, metodoPago: null });
    setOpenFilter(false); // Cerrar el filtro después de limpiar
  };
  // Obtener productos para la página actual
  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredOrder.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const isFilterActive = (filterType, value) =>
    selectedFilters[filterType] === value;

  return (
    <Layout>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      <div className="">
        <div className="my-3 mx-10">
          <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
            Bienvenidos
          </p>
        </div>

        <div className=" md:px-10 grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-emerald-100 bg-opacity-30 backdrop-blur-sm shadow-md">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-emerald-100 shadow-lg">
              <BiBriefcaseAlt className="text-3xl" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <p className="text-4xl font-bold whitespace-nowrap">
                {totalPedidos === 0 ? "0" : totalPedidos}
              </p>
              <p className="text-2xl text-gray-500 whitespace-nowrap">
                Total Pedidos
              </p>
            </div>
          </div>

          <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-amber-100 bg-opacity-30 backdrop-blur-sm shadow-md">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-amber-100 shadow-lg">
              <MdOutlinePendingActions className="text-3xl" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <p className="text-4xl font-bold whitespace-nowrap">
                {totalPedidosPendientes > 0 ? totalPedidosPendientes : "0"}
              </p>
              <p className="text-2xl text-gray-500 whitespace-nowrap">
                Total Pendientes
              </p>
            </div>
          </div>

          <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-blue-100 bg-opacity-30 backdrop-blur-sm shadow-md">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 shadow-lg">
              <FaMotorcycle className="text-3xl" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <p className="text-4xl font-bold whitespace-nowrap">
                {totalPedidosEntregados > 0 ? totalPedidosEntregados : "0"}
              </p>
              <p className="text-2xl text-gray-500 whitespace-nowrap">
                Total Entregados
              </p>
            </div>
          </div>
        </div>

        <div className="my-3 mx-10 mt-4">
          <p className="md:text-2xl text-2xl text-zinc-500 dark:text-white text-start md:text-left font-semibold">
            Pedidos
          </p>
        </div>

        <div className="">
          <div className="relative overflow-x-auto max-w-full  sm:rounded-lg">
            <div className="flex flex-col sm:flex-row flex-wrap items-center mx-8 justify-between pb-2">
              <div className="flex gap-4">
              {!searchVisible && (
        <div>
          <Tooltip content="Buscar Pedido">
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

                <div>
                  <Tooltip content="Filtrar por estado">
                    <div
                      onClick={() => setOpenFilter(!openFilter)}
                      className="bg-slate-50 cursor-pointer p-2 text-2xl rounded-full"
                    >
                      <IoFilter />
                    </div>
                  </Tooltip>
                </div>
                {openFilter && (
                <div className="flex justify-start gap-4 ">
                  <button
                    className={`p-2 rounded-full ${
                      isFilterActive("estado", "Solicitado")
                        ? "bg-red-100 text-black font-semibold"
                        : "bg-gray-50"
                    }`}
                    onClick={() => handleFilterChange("estado", "Solicitado")}
                  >
                    Solicitado
                  </button>
                  <button
                    className={`p-2 rounded-full ${
                      isFilterActive("estado", "Aceptado")
                        ? "bg-blue-100 text-black font-semibold"
                        : "bg-gray-50"
                    }`}
                    onClick={() => handleFilterChange("estado", "Aceptado")}
                  >
                    Aceptado
                  </button>
                  <button
                    className={`p-2 rounded-full ${
                      isFilterActive("estado", "Distribucion")
                        ? "bg-yellow-100 text-black font-semibold"
                        : "bg-gray-50"
                    }`}
                    onClick={() => handleFilterChange("estado", "Distribucion")}
                  >
                    Distribucion
                  </button>
                  <button
                    className={`p-2 rounded-full ${
                      isFilterActive("estado", "Entregado")
                        ? "bg-green-100 text-black font-semibold"
                        : "bg-gray-50"
                    }`}
                    onClick={() => handleFilterChange("estado", "Entregado")}
                  >
                    Entregado
                  </button>

                  <button
                    onClick={handleClearAndCloseFilters}
                
                  >
                    <p className="font-bold">Limpiar y cerrar filtros</p>
                  </button>
                </div>
              )}
              </div>

             

            
            </div>
            <div className="overflow-x-auto mx-4 shadow-md sm:rounded-lg">
              <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      hidden
                      className="px-2 py-2 sm:px-4 sm:py-3"
                    >
                      Id Pedido
                    </th>
                    <th
                      scope="col"
                      hidden
                      className="px-2 py-2 sm:px-0 sm:py-3"
                    >
                      Fecha
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-2 sm:py-3">
                      Nombre
                    </th>
                    <th
                      scope="col"
                      hidden
                      className="px-2 py-2 sm:px-0 sm:py-3"
                    >
                      Wp
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-0 sm:py-3">
                      Numero Contacto
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-0 sm:py-3">
                      Direccion
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3">
                      Punto de referencia
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-20 sm:py-3">
                      Descripcion
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-0 sm:py-3">
                      Metodo de pago
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-6 sm:py-3">
                      Valor
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-4 sm:py-3">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((order, index) => (
                    <tr key={order.id} className={getTrClasses(order.estado)}>
                      <td hidden className="px-2 py-2 sm:px-4 sm:py-3">
                        <Tooltip content={index}>
                          <span>{`0000${index}`}</span>
                        </Tooltip>
                      </td>
                      <td
                        hidden
                        className={`${
                          editOrderId === order.id ? "px-1 py-1" : "px-1 py-1"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            type="text"
                            hidden
                            onKeyDown={handleKeyDown}
                            value={formatDate(order.fecha)}
                            onChange={(e) => handleChange(e, "fecha")}
                            onBlur={handleBlur}
                            className="w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <span>{formatDate(order.fecha)}</span>
                        )}
                      </td>
                      <td
                        className={`${
                          editOrderId === order.id
                            ? "px-2 py-2 sm:px-0 sm:py-3"
                            : "px-2 py-2 sm:px-2 sm:py-3"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            type="text"
                            value={order.nombre}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => handleChange(e, "nombre")}
                            onBlur={handleBlur}
                            className="w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <Tooltip content={order.nombre}>
                            <span>{order.nombre}</span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        hidden
                        className={`${
                          editOrderId === order.id ? "px-1 py-1" : "px-1 py-1"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            hidden
                            type="number"
                            onKeyDown={handleKeyDown}
                            value={order.numeroWP}
                            onChange={(e) => handleChange(e, "numeroWP")}
                            onBlur={handleBlur}
                            className="w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <span>{order.numeroWP}</span>
                        )}
                      </td>
                      <td
                        className={`${
                          editOrderId === order.id ? "px-1 py-1" : "px-1 py-1"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            type="text"
                            onKeyDown={handleKeyDown}
                            value={order.numeroContacto}
                            onChange={(e) => handleChange(e, "numeroContacto")}
                            onBlur={handleBlur}
                            className="w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <Tooltip content={order.numeroContacto}>
                            <span>{order.numeroContacto}</span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        className={`${
                          editOrderId === order.id ? "px-1 py-1" : "px-1 py-1"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            type="text"
                            onKeyDown={handleKeyDown}
                            value={order.direccion}
                            onChange={(e) => handleChange(e, "direccion")}
                            onBlur={handleBlur}
                            className="w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <Tooltip content={order.direccion}>
                            <span>{order.direccion}</span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        className={`${
                          editOrderId === order.id ? "px-1 py-1" : "px-1 py-1"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            type="text"
                            onKeyDown={handleKeyDown}
                            value={order.puntoReferencia}
                            onChange={(e) => handleChange(e, "puntoReferencia")}
                            onBlur={handleBlur}
                            className="w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <Tooltip content={order.puntoReferencia}>
                            <span>{order.puntoReferencia}</span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        className={`${
                          editOrderId === order.id
                            ? "px-2 py-2 sm:px-0 sm:py-3 "
                            : "px-2 py-2 sm:px-0 sm:py-3"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            type="text"
                            value={order.descripcion}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => handleChange(e, "descripcion")}
                            onBlur={handleBlur}
                            className=" w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <Tooltip content={order.descripcion}>
                            <span className="text-center">
                              {order.descripcion}
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        className={`${
                          editOrderId === order.id
                            ? "px-2 py-2 sm:px-0 sm:py-3"
                            : "px-2 py-2 sm:px-4  sm:py-3"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <input
                            type="text"
                            value={order.metodoPago}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => handleChange(e, "metodoPago")}
                            onBlur={handleBlur}
                            className="w-full px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          />
                        ) : (
                          <Tooltip content={order.metodoPago}>
                            <span>{order.metodoPago}</span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        className={`${
                          editOrderId === order.id
                            ? "px-2 py-2 sm:px-0 sm:py-3"
                            : "px-2 py-2 sm:px-0 sm:py-3"
                        }`}
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <div>
                            <Tooltip content="Agregar Valor">
                              <button
                                onClick={openModal}
                                className="text-xs text-white font-medium me-2 px-10 py-0.5 bg-green-400  rounded border"
                              >
                                $
                              </button>
                            </Tooltip>

                            <Modal isOpen={isModalOpen} onClose={closeModal}>
                              <Carrito
                                ordenId={order.id}
                                closeModal={closeModal}
                                onBlur={handleBlur}
                                dataCarrito={order.carrito}
                                onKeyDown={handleKeyDown}
                                fetchOrders={fetchOrders}
                              />
                            </Modal>
                          </div>
                        ) : (
                          <Tooltip content={order.valor}>
                            <span>
                              {`${Number(order.valor).toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                              })}`}
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        className=" px-2 py-2 sm:px-0 sm:py-3"
                        onDoubleClick={() => handleDoubleClick(order.id)}
                      >
                        {editOrderId === order.id ? (
                          <select
                            className="text-xs font-medium me-2 px-2.5 py-0.5 rounded"
                            value={order.estado}
                            onBlur={handleBlur}
                            onChange={(e) =>
                              handleChangeselect(order.id, e.target.value)
                            }
                            disabled={order.valor === 0}
                          >
                            <option value="Solicitado">Solicitado</option>
                            <option value="Aceptado">Aceptado</option>
                            <option value="Distribucion">Distribucion</option>

                            <option value="Entregado">Entregado</option>
                          </select>
                        ) : (
                          <select
                            className=" me-2 px-2.5 py-0.5 rounded"
                            value={order.estado}
                            onBlur={handleBlur}
                            onChange={(e) =>
                              handleChangeselect(order.id, e.target.value)
                            }
                            disabled={order.valor === 0}
                          >
                            <option value="Solicitado">Solicitado</option>
                            <option value="Aceptado">Aceptado</option>
                            <option value="Distribucion">Distribucion</option>
                            <option value="Entregado">Entregado</option>
                          </select>
                        )}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3">
                        <div className="flex items-center space-x-2">
                          <Tooltip content="Editar">
                            <button
                              type="button"
                              onClick={() => handleEdit(order.id)}
                              className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-yellow-900"
                              >
                              <FaRegEdit />
                            </button>
                          </Tooltip>
                          <Tooltip content="Generar pdf">
                            <button
                              type="button"
                              onClick={() => generarFactura(order)}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                              >
                              <FaFileInvoice />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </div>
            <div className="flex justify-end mx-4 mt-6 items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded"
                >
                  Anterior
                </button>
                <span>{`Page ${currentPage} of ${Math.ceil(
                  filteredOrder.length / rowsPerPage
                )}`}</span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredOrder.length / rowsPerPage)
                  }
                  className="p-2 border border-gray-300 rounded"
                >
                  Siguiente
                </button>
              </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
