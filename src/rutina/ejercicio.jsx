import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaPlay, FaPause, FaRedo } from "react-icons/fa";
import "./ejercicio.css";

const Ejercicio = ({ 
  ejercicio, 
  onClose, 
  onNext, 
  onComplete,
  diaClase,
  index, 
  totalEjercicios 
}) => {
  const [completado, setCompletado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(ejercicio.duracion || 45);
  const [timerActivo, setTimerActivo] = useState(false);
  const [series, setSeries] = useState(Array(ejercicio.series || 1).fill(false));

  // Maneja el clic en el botón de completar
  const handleCompletar = () => {
    setCompletado(true);
    if (onComplete) {
      onComplete(ejercicio);
    }
  };

  // Maneja el clic en el botón de siguiente
  const handleSiguiente = () => {
    if (onNext) {
      onNext(ejercicio);
    }
  };

  // Alterna el estado del temporizador
  const toggleTimer = () => {
    setTimerActivo(!timerActivo);
  };

  // Reinicia el temporizador
  const resetTimer = () => {
    setTiempoRestante(ejercicio.duracion || 45);
    setTimerActivo(false);
  };

  // Marca una serie como completada
  const completarSerie = (index) => {
    const nuevasSeries = [...series];
    nuevasSeries[index] = !nuevasSeries[index];
    setSeries(nuevasSeries);
  };

  // Formatea el tiempo en formato MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

      {/* Imagen o Video del ejercicio */}
      <div className="ejercicio-media-container">
  {ejercicio.url.includes(".mp4") ? (
    <video 
      className="ejercicio-detalle-media" 
      controls 
      autoPlay 
      loop 
      poster={ejercicio.thumbnail || null}
      key={ejercicio.url}  // Esto forzará la recarga del video cuando cambie la URL
    >
      <source src={ejercicio.url} type="video/mp4" />
      Tu navegador no soporta el video.
    </video>
  ) : (
    <img 
      src={ejercicio.url} 
      alt={ejercicio.nombre} 
      className="ejercicio-detalle-media" 
      key={ejercicio.url}  // También se puede hacer con la imagen
    />
  )}
</div>


          {/* Información del ejercicio */}
          <div className="ejercicio-info-container">
            <div className="ejercicio-info-item">
              <span className="info-label">Repeticiones:</span>
              <span className="info-value">{ejercicio.repeticionesEjercicio}</span>
            </div>
            
            {ejercicio.peso && (
              <div className="ejercicio-info-item">
                <span className="info-label">Peso:</span>
                <span className="info-value">{ejercicio.peso} kg</span>
              </div>
            )}
            
            {ejercicio.descanso && (
              <div className="ejercicio-info-item">
                <span className="info-label">Descanso:</span>
                <span className="info-value">{ejercicio.descanso} seg</span>
              </div>
            )}
          </div>

          {/* Temporizador 
          <div className="temporizador-container">
            <div className="temporizador-display">
              {formatTime(tiempoRestante)}
            </div>
            <div className="temporizador-controles">
              <button className="timer-btn" onClick={toggleTimer}>
                {timerActivo ? <FaPause /> : <FaPlay />}
              </button>
              <button className="timer-btn" onClick={resetTimer}>
                <FaRedo />
              </button>
            </div>
          </div>
          */}
          

          

         

          {/* Botones de acción */}
          <div className="ejercicio-acciones">
            <button 
              className={`completar-btn ${completado ? 'btn-completado' : ''}`} 
              onClick={handleCompletar}
              disabled={completado}
            >
              <FaCheckCircle /> {completado ? 'Completado' : 'Completar ejercicio'}
            </button>
            <button className="siguiente-btn" onClick={handleSiguiente}>
              Siguiente ejercicio <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ejercicio;