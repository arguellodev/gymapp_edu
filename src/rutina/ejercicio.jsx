import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import Lottie from "lottie-react";
import "./ejercicio.css";

const Ejercicio = ({ ejercicio, onClose, onNext, onComplete, diaClase, index, totalEjercicios }) => {
  const [completado, setCompletado] = useState(false);
  const [animacion, setAnimacion] = useState(null);

  useEffect(() => {
    fetch("/ejercicio1.json") // ✅ Cargar JSON en vez de .lottie
      .then((res) => res.json())
      .then((data) => setAnimacion(data))
      .catch((err) => console.error("Error cargando la animación:", err));
  }, []);

  return (
    <div className={`ejercicio-modal ${diaClase}`}>
      <div className="ejercicio-modal-contenido">
        <div className="ejercicio-modal-header">
          <button className="cerrar-btn" onClick={onClose}>
            <FaArrowLeft /> Volver
          </button>
          <div className="ejercicio-contador">
            {index + 1} / {totalEjercicios}
          </div>
        </div>

        <div className="ejercicio-detalle">
          <h2 className="ejercicio-detalle-titulo">{ejercicio.nombre}</h2>

          <div className="ejercicio-media-container">
            {animacion ? <Lottie animationData={animacion} loop={true} style={{ width: 300, height: 300 }} /> : <p>Cargando animación...</p>}
          </div>

          <div className="ejercicio-acciones">
            <button className={`completar-btn ${completado ? "btn-completado" : ""}`} onClick={() => setCompletado(true)} disabled={completado}>
              <FaCheckCircle /> {completado ? "Completado" : "Completar ejercicio"}
            </button>
            <button className="siguiente-btn" onClick={onNext}>
              Siguiente ejercicio <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ejercicio;
