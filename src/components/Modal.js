import React from "react";

const Modal = ({ isOpen, onClose, children,nombre }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg ">
     <div className="flex justify-between">
     
       <p className="text-xl font-semibold text-slate-500">{nombre}</p>
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
