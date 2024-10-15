import React from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({
  isOpen,
  onClose,
  children,
  children2,
  nombre,
  size = "fixed", 
  Fondo = "none",
}) => {
  if (!isOpen) return null;

  const modalSizeClass =
    size === "fixed"
      ? "w-full max-w-[90vw] h-[80vh]" // Tamaño para modales más pequeños
      : "w-[900px] h-[700px] max-w-full max-h-full"; // Tamaño para modales más grandes

  const fondoClass =
    Fondo === "none"
      ? "fixed z-[999] inset-0 bg-black bg-opacity-40" // Fondo con opacidad
      : "fixed z-[999] inset-0 bg-gray-800 bg-opacity-20"; // Fondo alternativo

  return (
    <div className={`fixed z-[999] inset-0 flex justify-center items-center ${fondoClass}`}>
      {/* Contenedor del modal */}
      <div
        className={`bg-[#212529] p-2 rounded-lg z-[999] overflow-y-auto shadow-lg relative ${modalSizeClass} animate-slide-up`}
      >
        {/* Cabecera fija dentro del modal */}
        <div className="fixed top-0 left-0 right-0 flex justify-between items-center gap-20 p-4 z-10">
          <div className="flex justify-center items-center gap-2">
            <p className="text-xl font-semibold text-white">{nombre}</p>
          </div>
          <button onClick={onClose} className="text-[40px] text-white">
            <IoMdClose />
          </button>
        </div>

        {/* Contenido debajo de la cabecera */}
        <div className="pt-20"> {/* pt-20 asegura espacio debajo de la cabecera */}
          {children}
        </div>

        {/* Sección inferior del modal
        <div className="flex bg-slate-100 justify-between gap-20 p-4">
          {children2}
        </div> */}
      </div>
    </div>
  );
};

export default Modal;
