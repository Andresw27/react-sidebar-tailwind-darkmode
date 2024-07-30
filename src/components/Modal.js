import React from "react";
import { Tooltip } from "@material-tailwind/react";

const Modal = ({
  isOpen,
  onClose,
  children,
  nombre,
  accion,
  acciononClick,
  conteTooltip
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg ">
        <div className="flex justify-between">
          <div className="flex justify-center items-center gap-2">
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

        {children}
      </div>
    </div>
  );
};

export default Modal;
