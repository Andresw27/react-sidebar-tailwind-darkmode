import React from "react";
import { Tooltip } from "@material-tailwind/react";

const Modal = ({
  isOpen,
  onClose,
  children,
  nombre,
  accion,
  acciononClick,
  conteTooltip,
  size = "fixed", 
  Fondo = "none" ,
  
}) => {
  if (!isOpen) return null;

  const modalSizeClass =
    size === "fixed" ? "w-4/5 h-4/5" : "w-auto h-auto max-w-full max-h-full"; 
 const fondo =
    Fondo==="none" ? "fixed z-50 inset-0 bg-gray-800 bg-opacity-40":"fixed z-50 inset-0 bg-gray-800 bg-opacity-20";
  return (
    <div className={`fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center ${fondo}`}>
      <div className={`bg-white p-4 rounded shadow-lg overflow-y-auto ${modalSizeClass}`}>
        <div className="flex justify-between gap-20">
          <div className="flex justify-center items-center gap-2 ">
            <p className="text-xl font-semibold text-slate-500">{nombre}</p>
            {accion && (
              <Tooltip content={conteTooltip} className="z-50">
                <div
                  onClick={acciononClick}
                  className="bg-slate-50 hover:bg-black cursor-pointer gap-2 p-2 text-2xl flex justify-center items-center rounded-full"
                >
                  {accion}
                </div>
              </Tooltip>
            )}
          </div>

          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            x
          </button>
        </div>
        <div className="">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
