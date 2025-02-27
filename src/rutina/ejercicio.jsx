import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import Lottie from "lottie-react";
import "./ejercicio.css";

const Ejercicio = ({ ejercicio, esUltimoEjercicio, esUltimaSerie, onSiguiente, onFinalizar }) => {
  const [tiempo, setTiempo] = useState(ejercicio.tiempo || 0);
  const [cronometroActivo, setCronometroActivo] = useState(false);
  const [recomendacionesAbiertas, setRecomendacionesAbiertas] = useState(false);
  const [animacionData, setAnimacionData] = useState(null);
  const [nombreEjercicio, setNombreEjercicio] = useState(""); // Nuevo estado para el nombre
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setTiempo(ejercicio.tiempo || 0);
    setCronometroActivo(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [ejercicio]);

  useEffect(() => {
    const cargarAnimacion = async () => {
      try {
        const response = await fetch(ejercicio.url);
        const data = await response.json();

        setAnimacionData(data);
        setNombreEjercicio(data.nm || "Ejercicio sin nombre"); // Extraer el nombre del JSON
      } catch (error) {
        console.error("Error al cargar la animación:", error);
        setNombreEjercicio("Error al cargar nombre");
      }
    };

    setAnimacionData(null);
    setNombreEjercicio("");
    cargarAnimacion();
  }, [ejercicio.url]);

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
    setTiempo(ejercicio.tiempo || 0);
  };

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="ejercicio-container">
      <h2 className="ejercicio-titulo">{nombreEjercicio}</h2> {/* Nombre extraído del JSON */}

      <div className="ejercicio-animacion-container">
        <div className="ejercicio-animacion">
          {animacionData ? (
            <Lottie
              animationData={animacionData}
              loop={true}
              key={ejercicio.url}
              style={{ width: 300, height: 300,  filter: ' hue-rotate(10deg) saturate(0.8) brightness(1.1) contrast(1)' }}
            />
          ) : (
            <p className="ejercicio-animacion-placeholder">Cargando animación...</p>
          )}
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

        {ejercicio.repeticionesEjercicio > 0 && (
          <div className="ejercicio-metrica repeticiones">
            <h3 className="ejercicio-metrica-titulo">Repeticiones</h3>
            <p className="ejercicio-metrica-valor">{ejercicio.repeticionesEjercicio}</p>
          </div>
        )}

        {ejercicio.tiempo > 0 && (
          <div className="ejercicio-metrica tiempo">
            <h3 className="ejercicio-metrica-titulo">Tiempo</h3>
            <p className="ejercicio-metrica-valor">{formatearTiempo(tiempo)}</p>
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
          onClick={esUltimoEjercicio && esUltimaSerie ? onFinalizar : onSiguiente}
          className="ejercicio-boton siguiente"
        >
          {esUltimoEjercicio && esUltimaSerie ? "Finalizar serie" : "Siguiente ejercicio"}
        </button>
      </div>
    </div>
  );
};

export default Ejercicio;
