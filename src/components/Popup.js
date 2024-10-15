import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { collection, getDocs ,query,where} from "firebase/firestore";
import { db } from "../firebase-config";

const Popup = ({ isVisible, onClose }) => {
  const { nombreEmpresa } = useParams(); 
  const [dataPublicidades, setdataPublicidades] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [identificador, setIdentificador] = useState(null); // Para guardar el identificador del usuario

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

  // Fetch de publicidades cuando identificador esté disponible
  useEffect(() => {
    const fetchPublicidades = async () => {
      if (!identificador) return; // Aseguramos que haya identificador antes de ejecutar

      try {
        const publicidadCollectionRef = collection(db, "config", identificador, "publicidad");
        const snapshot = await getDocs(publicidadCollectionRef);
        const publicidades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setdataPublicidades(publicidades);
        console.log(dataPublicidades)
      } catch (error) {
        console.error("Error al obtener las publicidades:", error);
        setError("Hubo un problema al cargar las publicidades. Intente de nuevo.");
      }
    };

    if (identificador) {
      fetchPublicidades();
    }
  }, [identificador]); // Solo se ejecuta cuando identificador cambia

  // Filtrar las publicidades activas
  const publicidadesActivas = dataPublicidades.filter((publicidad) => publicidad.estado === "true");

  // Este efecto solo se activará si hay publicidades activas y el popup está visible
  useEffect(() => {
    if (isVisible && publicidadesActivas.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible, publicidadesActivas.length]);

  useEffect(() => {
    if (publicidadesActivas.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % publicidadesActivas.length);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [publicidadesActivas.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % publicidadesActivas.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? publicidadesActivas.length - 1 : prevIndex - 1
    );
  };

  // No renderizar si el popup no está visible o no hay publicidades activas
  if (!isVisible || publicidadesActivas.length === 0) return null;

  return (
    <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white hover:text-gray-400 text-4xl font-bold"
      >
        &times;
      </button>

      <div className="popup-content rounded-lg shadow-lg relative">
        <div className="slider relative">
          <a href={dataPublicidades.hrf} target="_blank" >
          <img
            src={publicidadesActivas[currentIndex].imagen}
            alt={publicidadesActivas[currentIndex].nombre}
            className="rounded-lg w-full h-[350px] md:h-[580px] object-cover"
          />
          </a>
        
          {publicidadesActivas.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 rounded-full"
              >
                &#10094;
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 rounded-full"
              >
                &#10095;
              </button>
            </>
          )}

          <div className="flex justify-center mt-4">
            {publicidadesActivas.map((_, index) => (
              <span
                key={index}
                className={`mx-1 w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-600'
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
