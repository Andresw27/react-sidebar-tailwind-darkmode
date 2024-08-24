import React, { useEffect, useState,useContext } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from "@material-tailwind/react";
import Alert from "../components/Alert"; // Importa el componente de alerta
import { IoSearch, IoClose } from "react-icons/io5";

import { UserContext } from "../UserContext"; // Asegúrate de ajustar la ruta correcta
import { useSelector } from "react-redux";

function Productos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [dataProductos, setDataProductos] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [valorProducto, setValorProducto] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isModalOpenn, setIsModalOpenn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  
  const {identificador}=useSelector(state=>state.user)

  

  const handleSearchClick = () => {
    setSearchVisible(true);
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

  const fetchProductos = async () => {
    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/productos/${identificador}`
      );
      const data = await response.json();
      setDataProductos(data.productos);
    } catch (error) {
      setAlertMessage("Error al obtener los datos. recarge la página e inténtalo nuevamente.");
      setShowErrorAlert(true);
      
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      nombre: nombreProducto,
      precio: valorProducto,
    };

    try {
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
        setAlertMessage("Error al registrar el producto. Inténtalo nuevamente.");
        setShowErrorAlert(true);
        closeModal();
      }

      const result = await response.json();
      // console.log("Product registered successfully:", result);
      setAlertMessage("Producto añadido con éxito");
      setShowAlert(true);
      setNombreProducto("");
      setValorProducto("");
      closeModal();
      fetchProductos();
    } catch (error) {
      // console.error("Error registering product:", error);
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
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setProductToEdit(null);
    setNombreProducto("");
    setValorProducto("");
    setEditModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!productToEdit) {
      // console.error("No product to edit");
      return;
    }
    const updatedProduct = {
      ...productToEdit,
      nombre: nombreProducto,
      precio: valorProducto,
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
                
                <div>
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Nombre producto"
                    required
                  />
                </div>
                <div>
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
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
                Precio
              </th>
              <th scope="col" className="px-6 py-3">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <p className="text-center text-title mt-10 mb-10">
                No hay productos disponibles por favor agregue un producto
              </p>
            ) : (
              currentProducts.map((product, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {product.nombre}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {`${Number(product.valor).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}`}{" "}
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
              <div>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Nombre producto"
                  required
                />
              </div>
              <div>
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
                  placeholder="$"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
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
