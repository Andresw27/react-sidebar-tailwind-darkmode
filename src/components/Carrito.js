import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import '../index.css'

function Carrito({ closeModal, fetchOrders, ordenId, dataCarrito, onBlur,order }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [cart, setCart] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [dataProductos, setDataProductos] = useState([]);
  const { identificador, valorMinimo, PuntosporValor } = useSelector(state => state.user);
  const [numeroWp,setNumeroWp] = useState(0);

  let Puntos=Number(PuntosporValor)
  console.log("Puntos",Puntos)

  useEffect(() => {
    if (order && order.numeroWp) {
      setNumeroWp(order.numeroWp);
      console.log('numeroWp',numeroWp);
    }
  }, [order]);


  console.log('valorminimo', valorMinimo);
  useEffect(() => {
    if (dataCarrito && dataCarrito.length > 0) {
      const initialCart = dataCarrito.map(item => ({
        nombre: item.producto,
        valor: item.valorp,
        quantity: item.cantidad
      }));
      setCart(initialCart);
    }
  }, [dataCarrito]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`https://us-central1-jeicydelivery.cloudfunctions.net/app/productos/${identificador}`);
        const data = await response.json();
        setDataProductos(data.productos);
        console.log("la data es", data.productos);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchProductos();
  }, [identificador]);

  const filteredProducts = dataProductos.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.valor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.nombre === product.nombre);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.nombre === product.nombre
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter((item) => item.nombre !== productName));
  };

  const updateCartQuantity = (productName, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productName);
    } else {
      setCart(
        cart.map((item) =>
          item.nombre === productName ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.valor * item.quantity;
    }, 0);
  };

  const handleUpdateTotalValue = async () => {
    const total = calculateTotal();
    setTotalValue(total);

    const carritoV = cart.map(item => ({
      producto: item.nombre,
      cantidad: item.quantity,
      valor: item.valor
    }));

    console.log("el total" , total,typeof(valorMinimo),typeof(PuntosporValor));

    if (total >= valorMinimo) {
      console.log("El total es mayor al valor mínimo", total+ " > " + valorMinimo);
      try {
        const response = await fetch(`https://us-central1-jeicydelivery.cloudfunctions.net/app/puntos/update/${identificador}/${numeroWp}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({puntos: Puntos/2}),
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }else{
          console.log("ok y puntos actualizados",Puntos,total)
        }
      
        const updatedTotal = await response.text();
        console.log("Puntos actualizados:", updatedTotal);
      
      } catch (error) {
        console.error("Error al actualizar los puntos:", error.message);
      }
      
    }

    try {
      const response = await fetch(
        `https://us-central1-jeicydelivery.cloudfunctions.net/app/pedidos/${identificador}/${ordenId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ valor: total, carrito: carritoV }),
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo actualizar el valor total desde la API");
      }

      const updatedTotal = await response.text();
      console.log("Valor total actualizado:", updatedTotal);
    } catch (error) {
      console.error("Error al actualizar el valor total:", error);
    }
  };

  const handleAddTotalValue = async () => {
    await handleUpdateTotalValue();
    closeModal();
  };

  const handleClick = async () => {
    await handleAddTotalValue();
    await handleUpdateTotalValue();
    closeModal();
    onBlur();
  };

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <div className="col-span-2 h-96 relative  shadow-md sm:rounded-lg ">
        <div className="flex justify-between items-center p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="Buscar Producto..."
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded"
            >
              Previous
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
              Next
            </button>
          </div>
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
                Accion
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {product.nombre}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {`${Number(product.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Agregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-span-1 relative h-96 shadow-md  overflow-y-auto  sm:rounded-lg bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">Carrito de Compras</h2>
        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="  h-48 overflow-y-auto">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <span className="font-semibold">{item.nombre}</span> - $
                    {item.valor} x {item.quantity}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.nombre, item.quantity - 1)
                      }
                      className="px-2 text-gray-600"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.nombre, item.quantity + 1)
                      }
                      className="px-2 text-gray-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.nombre)}
                      className="px-2 text-red-600"
                    >
                      x
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-center flex-col">
            <div className="mt-4 flex justify-between items-center">
              <span className="font-semibold text-base">TOTAL:</span>
              <span className="font-bold text-lg">
                {`${Number(calculateTotal()).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`}
              </span>
            </div>
            <button
              onClick={handleClick}
              className="mt-4 text-base font-bold bg-blue-500 text-white px-4 py-2 rounded"
            >
              Agregar Valor Total
            </button>
            </div>
           
          </>
        )}
      </div>
    </div>
  );
}

export default Carrito;
