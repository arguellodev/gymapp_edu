import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import Timer from "./timer";
import Lottie from "lottie-react";
import "./ejercicio.css";
import LottieAnimation from "../visualizador_lottie/visualizador";

const Ejercicio = ({ ejercicio, esUltimoEjercicio, esUltimaSerie, onSiguiente, onFinalizar }) => {
  console.log(ejercicio);
  
  // Inicialización correcta del estado tiempo
  const [tiempo, setTiempo] = useState(() => {
    // Si la unidad es minutos, convertir a segundos
    if (ejercicio.unidadTiempo === 'min' && ejercicio.tiempo) {
      return ejercicio.tiempo * 60;
    }
    // Si no, usar el valor tal cual está
    return ejercicio.tiempo || 0;
  });
  
  const [cronometroActivo, setCronometroActivo] = useState(false);
  const [recomendacionesAbiertas, setRecomendacionesAbiertas] = useState(false);
  const [animacionData, setAnimacionData] = useState(null);
  const [nombreEjercicio, setNombreEjercicio] = useState(""); // Nuevo estado para el nombre
  const timerRef = useRef(null);
  const [showTimer, setShowTimer] = useState(false);

  const handleTimerComplete = () => {
    // Esto debe quitar el temporizador de la pantalla
    setShowTimer(false);
    
    // Puedes agregar lógica adicional aquí si es necesario
    onSiguiente(); // Por ejemplo, ir al siguiente ejercicio
  };

  const handleSiguienteClick = () => {
    // Activar el temporizador
    clearInterval(timerRef.current);
    setCronometroActivo(false);
     setShowTimer(true);
    
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Este useEffect ahora aplica la misma lógica de conversión cuando el ejercicio cambia
  useEffect(() => {
    // Aplicar la misma lógica de conversión cuando ejercicio cambia
    if (ejercicio.unidadTiempo === 'min' && ejercicio.tiempo) {
      setTiempo(ejercicio.tiempo * 60);
    } else {
      setTiempo(ejercicio.tiempo || 0);
    }
    
    setCronometroActivo(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [ejercicio]);

  const toggleCronometro = () => {
    if (cronometroActivo) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTiempo((prevTiempo) => {
          if (prevTiempo <= 1) {
            clearInterval(timerRef.current);
            setCronometroActivo(false);
            return 0;
          }
          return prevTiempo - 1;
        });
      }, 1000);
    }
    setCronometroActivo(!cronometroActivo);
  };

  const reiniciarCronometro = () => {
    clearInterval(timerRef.current);
    setCronometroActivo(false);
    
    // Reiniciar aplicando la misma lógica de conversión
    if (ejercicio.unidadTiempo === 'min' && ejercicio.tiempo) {
      setTiempo(ejercicio.tiempo * 60);
    } else {
      setTiempo(ejercicio.tiempo || 0);
    }
  };

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="ejercicio-container">
      <h2 className="ejercicio-titulo-rutina">{ejercicio.nombre}</h2> {/* Nombre extraído del JSON */}

      <div className="ejercicio-animacion-container">
        <div className="ejercicio-animacion">
          <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio.nombre}.json`}></LottieAnimation>
          {console.log(ejercicio.nombre)}
        </div>
      </div>

      <div className="ejercicio-metricas">
        {ejercicio.peso > 0 && (
          <div className="ejercicio-metrica peso">
            <h3 className="ejercicio-metrica-titulo">Peso</h3>
            <p className="ejercicio-metrica-valor">
              {ejercicio.peso} {ejercicio.unidadPeso}
            </p>
          </div>
        )}

        {ejercicio.repeticiones > 0 && (
          <div className="ejercicio-metrica repeticiones">
            <h3 className="ejercicio-metrica-titulo">Repeticiones</h3>
            <p className="ejercicio-metrica-valor">{ejercicio.repeticiones}</p>
          </div>
        )}

        {ejercicio.tiempo > 0 && (
          <div className="ejercicio-metrica tiempo">
            <h3 className="ejercicio-metrica-titulo">Tiempo</h3>
            <p className="ejercicio-metrica-valor">
              {formatearTiempo(tiempo)}</p>
            <div className="ejercicio-cronometro-controles">
              <button
                onClick={toggleCronometro}
                className={`ejercicio-boton ${cronometroActivo ? "pausar" : "iniciar"}`}
              >
                {cronometroActivo ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={reiniciarCronometro} className="ejercicio-boton reiniciar">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
        
      <div className="ejercicio-botones">
        <button
          onClick={handleSiguienteClick}
          className="ejercicio-boton siguiente"
        >
          {esUltimoEjercicio && esUltimaSerie ? "Finalizar Bloque" : "Siguiente ejercicio"}
        </button>

        {showTimer ?
          <Timer 
            seconds={esUltimoEjercicio ? ejercicio.descansoSerie : ejercicio.descansoEjercicio}  // Duración del temporizador
            onComplete={handleTimerComplete} 
            esUltimoEjercicio={esUltimoEjercicio}
          />
          : null
        }
        {console.log(ejercicio)}
      </div>
    </div>
  );
};

export default Ejercicio;