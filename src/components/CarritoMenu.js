import React, {useState} from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import AlertMenu from "./AlertMenu";

function CarritoMenu({ carrito, setcarrito }) {
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState("");

  const removeFromCart = (productName) => {
    setcarrito(carrito.filter((item) => item.nombre !== productName));
    setAlertMessage("Producto Agregado ");
    setShowAlert(true);
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

  // Calcular el total general del carrito
  const totalCarrito = carrito.reduce((total, producto) => {
    return total + producto.valor * producto.quantity; // Multiplica el valor por la cantidad
  }, 0);

  return (
    <>
      {showAlert && (
        <AlertMenu message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      {carrito.length === 0 ? (
        <div>
          <p className="text-white text-base">
            No hay productos agregados a tu compra
          </p>
        </div>
      ) : (
        <div className="bg-[#32383e] overflow-y-auto p-2 rounded h-[400px]">
          {carrito.map((producto, index) => (
            <div
              key={index}
              className={`flex gap-2 mt-5 p-2 ${
                index !== carrito.length - 1 ? "border-b-[1px]" : ""
              }`}
            >
              <div className="w-20 h-20 bg-slate-900 rounded">
                <img
                  className="rounded"
                  src={producto.foto}
                  alt={producto.nombre}
                />
              </div>
              <div className="flex flex-col w-[180px] ">
                <p className="text-[15px] font-medium text-white w-34">
                  {producto.nombre}
                </p>
                <p className="text-xs text-white font-medium">
                  {/* Mostrar el total por producto */}
                  {Number(producto.valor * producto.quantity).toLocaleString(
                    "es-CO",
                    {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }
                  )}
                </p>
                <div className="input-group mt-[5px] flex flex-wrap items-stretch h-[31px] relative w-[105px] min-w-[105px]">
                  <input
                    type="number"
                    step="1"
                    value={producto.quantity} // Usamos la cantidad del carrito
                    name="quantity"
                    className="quantity-field"
                    readOnly
                  />
                  <span className="flex justify-between p-[2px] absolute w-full">
                    <input
                      type="button"
                      value="-"
                      className="button-minus"
                      data-field="quantity"
                      onClick={() =>
                        updateCartQuantity(
                          producto.nombre,
                          producto.quantity - 1
                        )
                      }
                    />
                    <input
                      type="button"
                      value="+"
                      onClick={() =>
                        updateCartQuantity(
                          producto.nombre,
                          producto.quantity + 1
                        )
                      }
                      className="button-plus"
                      data-field="quantity"
                    />
                  </span>
                </div>
              </div>
              <div className="flex items-start">
                <FaRegTrashAlt
                  onClick={() => removeFromCart(producto.nombre)}
                  className="text-[25px] text-red-600 cursor-pointer"
                />
              </div>
            </div>
          ))}
          {/* Mostrar el total del carrito */}
        </div>
      )}
      <div className="mt-5 p-2 border-t-[1px] border-t-slate-800 text-white font-medium text-lg flex justify-between items-center">
        <p className="text-xl">Total:</p>
        <div className=" text-white font-medium text-base">
          {Number(totalCarrito).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
      </div>
      <div className="b flex justify-center items-center">
        <button
          disabled={carrito.length === 0 ? true : false}
          className={
            carrito.length === 0
              ? "bg-slate-300 p-4 text-xl w-full rounded-md text-white font-medium"
              : "bg-red-600 p-4 text-xl w-full rounded-md text-white font-medium"
          }
        >
          Realizar Pedido
        </button>
      </div>
    </>
  );
}

export default CarritoMenu;
