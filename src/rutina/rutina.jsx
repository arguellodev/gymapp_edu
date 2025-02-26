import React, { useState } from "react";
import rutinaData from "../data/rutina.json";
import { 
  FaArrowLeft, 
  FaPlay,
  FaChevronRight, 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaEye
} from "react-icons/fa";
import "./rutina.css";
import Ejercicio from "./ejercicio"; // Importamos el nuevo componente

const Rutina = () => {
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [serieExpandida, setSerieExpandida] = useState(null);
  const [mostrarEjercicioModal, setMostrarEjercicioModal] = useState(false);
  const [ejercicioEnModal, setEjercicioEnModal] = useState(null);
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState([]);
  
  // Obtener el índice actual y total de ejercicios
  const getIndiceEjercicio = () => {
    if (!rutinaSeleccionada || !ejercicioEnModal) return { indice: 0, total: 0 };
    
    let totalEjercicios = 0;
    let indiceActual = 0;
    let encontrado = false;
    
    rutinaSeleccionada.series.forEach(serie => {
      serie.ejercicios.forEach(ejercicio => {
        if (!encontrado) {
          if (ejercicio.nombre === ejercicioEnModal.nombre) {
            encontrado = true;
          } else {
            indiceActual++;
          }
        }
        totalEjercicios++;
      });
    });
    
    return { indice: indiceActual, total: totalEjercicios };
  };

  const iniciarRutina = (dia) => {
    setRutinaSeleccionada(dia);
    setSerieExpandida(0);
  };

  const volverALista = () => {
    setRutinaSeleccionada(null);
    setEjercicioActivo(null);
    setSerieExpandida(null);
    setMostrarEjercicioModal(false);
    setEjercicioEnModal(null);
  };

  const toggleSerie = (index) => {
    setSerieExpandida(serieExpandida === index ? null : index);
  };

  const toggleEjercicio = (ejercicio) => {
    setEjercicioActivo(ejercicioActivo === ejercicio ? null : ejercicio);
  };

  // Función para mostrar el modal de ejercicio
  const mostrarEjercicio = (ejercicio) => {
    setEjercicioEnModal(ejercicio);
    setMostrarEjercicioModal(true);
  };

  // Función para cerrar el modal de ejercicio
  const cerrarEjercicioModal = () => {
    setMostrarEjercicioModal(false);
    setEjercicioEnModal(null);
  };

  // Función para marcar un ejercicio como completado
  const completarEjercicio = (ejercicio) => {
    if (!ejerciciosCompletados.includes(ejercicio.nombre)) {
      setEjerciciosCompletados([...ejerciciosCompletados, ejercicio.nombre]);
    }
  };

  // Función para ir al siguiente ejercicio
  const siguienteEjercicio = (ejercicioActual) => {
    if (!rutinaSeleccionada) return;
    
    let encontrarSiguiente = false;
    let siguienteEjercicio = null;
    
    // Iteramos a través de las series para encontrar el siguiente ejercicio
    outerLoop: for (const serie of rutinaSeleccionada.series) {
      for (const ejercicio of serie.ejercicios) {
        if (encontrarSiguiente) {
          siguienteEjercicio = ejercicio;
          break outerLoop;
        }
        if (ejercicio.nombre === ejercicioActual.nombre) {
          encontrarSiguiente = true;
        }
      }
    }
    
    if (siguienteEjercicio) {
      setEjercicioEnModal(siguienteEjercicio);
    } else {
      // Si no hay siguiente ejercicio, cerramos el modal
      cerrarEjercicioModal();
    }
  };

  // Función para obtener la clase según el día
  const getClassByDay = (dia) => {
    const clases = {
      "Lunes": "dia-lunes",
      "Martes": "dia-martes",
      "Miércoles": "dia-miercoles",
      "Jueves": "dia-jueves",
      "Viernes": "dia-viernes",
      "Sábado": "dia-sabado",
      "Domingo": "dia-domingo"
    };
    return clases[dia] || "dia-default";
  };

  // Calcular índice y total de ejercicios
  const { indice, total } = getIndiceEjercicio();

  return (
    <div className="rutina-container">
      {/* Modal de ejercicio */}
      {mostrarEjercicioModal && ejercicioEnModal && (
        <Ejercicio 
          ejercicio={ejercicioEnModal}
          onClose={cerrarEjercicioModal}
          onNext={siguienteEjercicio}
          onComplete={completarEjercicio}
          diaClase={rutinaSeleccionada ? getClassByDay(rutinaSeleccionada.dia) : ""}
          index={indice}
          totalEjercicios={total}
        />
      )}

      {rutinaSeleccionada ? (
        <div className="detalle-rutina-card">
          <div className="detalle-header">
            <button 
              className="volver-btn"
              onClick={volverALista}
            >
              <FaArrowLeft /> Volver
            </button>
            <div className={`badge-dia ${getClassByDay(rutinaSeleccionada.dia)}`}>
              {rutinaSeleccionada.dia}
            </div>
          </div>

          <h1 className="titulo-rutina">{rutinaSeleccionada.descripcion}</h1>
          <div className="info-rutina">
            <FaCalendarAlt className="icono-info" />
            <span className="texto-info">{rutinaSeleccionada.dia}</span>
            <span className="separador"></span>
            <FaDumbbell className="icono-info" />
            <span className="texto-info">{rutinaSeleccionada.series.length} series</span>
          </div>

          <div className="lista-series">
            {rutinaSeleccionada.series.map((serie, index) => (
              <div 
                key={index} 
                className={`serie-card ${getClassByDay(rutinaSeleccionada.dia)} ${
                  serieExpandida === index ? 'serie-expandida' : ''
                }`}
              >
                <div 
                  className="serie-header"
                  onClick={() => toggleSerie(index)}
                >
                  <div className="serie-titulo-container">
                    <div className={`circulo-numero ${getClassByDay(rutinaSeleccionada.dia)}`}>
                      {index + 1}
                    </div>
                    <div className="serie-info">
                      <h3 className="serie-titulo">{serie.nombre}</h3>
                      <p className="serie-subtitulo">{serie.repeticionesSerie} veces</p>
                    </div>
                  </div>
                  <FaChevronRight 
                    className={`icono-expandir ${
                      serieExpandida === index ? 'icono-rotado' : ''
                    }`} 
                  />
                </div>

                <div className={`serie-contenido ${
                  serieExpandida === index ? 'contenido-visible' : ''
                }`}>
                  <div className="lista-ejercicios">
                    {serie.ejercicios.map((ejercicio, idx) => (
                      <div key={idx} className="ejercicio-item">
                        <div className="ejercicio-header">
                          <div className="ejercicio-titulo-container">
                            <div className={`circulo-ejercicio ${getClassByDay(rutinaSeleccionada.dia)} ${
                              ejerciciosCompletados.includes(ejercicio.nombre) ? 'ejercicio-completado' : ''
                            }`}>
                              {ejerciciosCompletados.includes(ejercicio.nombre) ? 
                                <FaCheckCircle /> : idx + 1
                              }
                            </div>
                            <div className="ejercicio-info">
                              <h4 className="ejercicio-titulo">{ejercicio.nombre}</h4>
                              <p className="ejercicio-subtitulo">{ejercicio.repeticionesEjercicio} repeticiones</p>
                            </div>
                          </div>
                          <button 
                            className="ver-ejercicio-btn"
                            onClick={() => mostrarEjercicio(ejercicio)}
                          >
                            <FaEye className="icono-ver" />
                            <span>Ver ejercicio</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="lista-rutinas-card">
          <h1 className="titulo-principal">Mi Rutina Semanal</h1>
          <p className="subtitulo-principal">Selecciona un día para comenzar tu entrenamiento</p>
          
          <div className="grid-rutinas">
            {rutinaData.rutina.map((dia, index) => (
              <div 
                key={index} 
                className={`rutina-card ${getClassByDay(dia.dia)}`}
              >
                <div className={`barra-superior ${getClassByDay(dia.dia)}`}></div>
                <div className="rutina-contenido">
                  <div className="rutina-header">
                    <h3 className="dia-titulo">{dia.dia}</h3>
                    <div className={`mini-badge ${getClassByDay(dia.dia)}`}>
                      {dia.series.length} series
                    </div>
                  </div>
                  
                  <p className="rutina-descripcion">{dia.descripcion}</p>
                  
                  <div className="ejercicios-info">
                    <FaDumbbell className="mini-icono" />
                    <span>
                      {dia.series.reduce((total, serie) => total + serie.ejercicios.length, 0)} ejercicios
                    </span>
                  </div>
                  
                  <button 
                    className={`empezar-btn ${getClassByDay(dia.dia)}`}
                    onClick={() => iniciarRutina(dia)}
                  >
                    <FaPlay className="play-icon" />
                    Empezar rutina
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rutina;