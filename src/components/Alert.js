import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

const Alert = ({ message, onClose, duration = 500, type = 'success' }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(true);
    const timer = setTimeout(() => {
      setIsShowing(false);
      setTimeout(onClose, 500); // Ajusta el tiempo de ocultamiento
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Define las clases de color según el tipo de alerta
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const hoverBgColor = type === 'success' ? 'bg-green-700' : 'bg-red-700';

  return (
    <Transition
      show={isShowing}
      enter="transform transition ease-in-out duration-300"
      enterFrom="translate-x-full opacity-0"
      enterTo="translate-x-0 opacity-100"
      leave="transform transition ease-in-out duration-300"
      leaveFrom="translate-x-0 opacity-100"
      leaveTo="translate-x-full opacity-0"
    >
      <div className={`fixed z-50 bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
        <span>{message}</span>
        <button
          className={`ml-4 ${hoverBgColor} hover:${hoverBgColor} text-white font-bold py-1 px-2 rounded`}
          onClick={() => setIsShowing(false)}
        >
          X
        </button>
      </div>
    </Transition>
  );
};

export default Alert;
