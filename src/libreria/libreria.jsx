import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import "./libreria.css";
import { IoMdArrowBack } from "react-icons/io";
import libreriaDatos from "../data/nueva_libreria.json";
import LottieAnimation from "../visualizador_lottie/visualizador";
import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";

const Libreria = ({ 
  type, 
  onEjercicioSeleccionado, 
  tipoBloque, 
  ejerciciosAgregados = [],
  maxEjercicios = null // Nueva prop para limitar el número de ejercicios
}) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubCategoriaSeleccionada] = useState(null);
  const [ejerciciosRestantes, setEjerciciosRestantes] = useState(
    maxEjercicios ? maxEjercicios - ejerciciosAgregados.length : null
  );
  const [mostrarLimiteAlcanzado, setMostrarLimiteAlcanzado] = useState(false);

  // Actualizar ejercicios restantes cuando cambia la lista de ejercicios agregados
  useEffect(() => {
    if (maxEjercicios !== null) {
      setEjerciciosRestantes(maxEjercicios - ejerciciosAgregados.length);
    }
  }, [ejerciciosAgregados, maxEjercicios]);

  const handleatras = () => {
    if (subcategoriaSeleccionada !== null) {
      setSubCategoriaSeleccionada(null);
    } else {
      setCategoriaSeleccionada(null);
    }
    setMostrarLimiteAlcanzado(false);
  };

  // Función para manejar el clic en un ejercicio
  const handleEjercicioClick = (ejercicio) => {
    if (type === "creador-rutina" && onEjercicioSeleccionado) {
      const estaAgregado = esEjercicioAgregado(ejercicio);
      
      // Si el ejercicio ya está agregado, permitir quitarlo
      if (estaAgregado) {
        onEjercicioSeleccionado(ejercicio);
        setMostrarLimiteAlcanzado(false);
        return;
      }
      
      // Si hay límite y ya se alcanzó, mostrar mensaje y no agregar
      if (maxEjercicios !== null && ejerciciosAgregados.length >= maxEjercicios) {
        setMostrarLimiteAlcanzado(true);
        return;
      }
      
      // Si no hay límite o no se ha alcanzado, agregar el ejercicio
      onEjercicioSeleccionado(ejercicio);
      setMostrarLimiteAlcanzado(false);
    }
  };

  // Función para verificar si un ejercicio ya fue agregado
  const esEjercicioAgregado = (ejercicio) => {
    if (type === "creador-rutina" && ejerciciosAgregados) {
      return ejerciciosAgregados.some((e) => e.nombre === ejercicio);
    }
    return false;
  };

  // Filtrar las categorías según el tipo de bloque
  const categoriasFiltradas = () => {
    if (type === "creador-rutina" && tipoBloque) {
      // Si el tipoBloque es "Cardio" o "Estiramiento", solo devuelve esa categoría
      if (tipoBloque === "Cardio" || tipoBloque === "Estiramiento") {
        return { [tipoBloque]: libreriaDatos[tipoBloque] };
      }
      // Para cualquier otro tipo de bloque, devuelve todas las categorías
      return libreriaDatos;
    }
    // Si no es "creador-rutina" o no hay tipoBloque, devuelve todas las categorías
    return libreriaDatos;
  };

  // Renderizar indicador de ejercicios restantes
  const renderIndicadorEjercicios = () => {
    if (maxEjercicios === null) return null;
    
    return (
      <div className="indicador-ejercicios">
        <div className={`contador-ejercicios ${ejerciciosRestantes <= 0 ? 'limite-alcanzado' : ''}`}>
          {ejerciciosRestantes > 0 ? (
            <>
              <span className="numero-restante">{ejerciciosRestantes}</span>
              <span className="texto-restante">ejercicio{ejerciciosRestantes !== 1 ? 's' : ''} restante{ejerciciosRestantes !== 1 ? 's' : ''}</span>
            </>
          ) : (
            <span className="texto-restante">Límite alcanzado ({maxEjercicios})</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="libreria-container">
        {/* Mostrar mensaje de límite alcanzado si es necesario */}
        {mostrarLimiteAlcanzado && (
          <div className="aviso-limite">
            <AiOutlineWarning className="icono-aviso" />
            <span>Has alcanzado el límite de {maxEjercicios} ejercicios para esta rutina</span>
          </div>
        )}

        {/* Indicador de ejercicios restantes siempre visible cuando hay límite */}
       

        {!categoriaSeleccionada ? (
          <div className="libreria-categorias-container">
            <h2 className="titulo-categorias-libreria">Categorías de ejercicios</h2>
            {Object.entries(categoriasFiltradas()).map(([categoria, subcategorias]) => (
              <div
                key={categoria}
                className="categoria-item"
                onClick={() => setCategoriaSeleccionada(categoria)}
              >
                <h2>{categoria}</h2>
                <LottieAnimation className="lottie-item" jsonPath={`./caratulas/${categoria}.json`} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {Array.isArray(libreriaDatos[categoriaSeleccionada]) ? (
              <div className="ejercicios-container-libreria">
                <div className="header-libreria">
                  <button className="boton-atras" onClick={() => handleatras()}>
                    <IoMdArrowBack />
                  </button>
                  <p>{categoriaSeleccionada}</p>
                </div>
                {maxEjercicios !== null && renderIndicadorEjercicios()}
                <div className="ejercicios-lista-libreria">
                  {libreriaDatos[categoriaSeleccionada].map((ejercicio, index) => (
                    <div
                      key={index}
                      className={`ejercicio-item-libreria ${
                        esEjercicioAgregado(ejercicio) ? "ejercicio-agregado" : ""
                      } ${
                        !esEjercicioAgregado(ejercicio) && maxEjercicios !== null && ejerciciosAgregados.length >= maxEjercicios ? "ejercicio-deshabilitado" : ""
                      }`}
                      onClick={() => handleEjercicioClick(ejercicio)}
                    >
                      <p>{ejercicio}</p>
                      <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`} />
                      {esEjercicioAgregado(ejercicio) && <p className="palomita-checked"><FaCheckCircle /></p>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="subcategorias-container-libreria">
                
                <div className="header-libreria">
                  
                  <button className="boton-atras" onClick={() => handleatras()}>
                    <IoMdArrowBack />
                  </button>
                  <p>{categoriaSeleccionada}</p>
                 
                </div>
               
                <div className="subcategorias-lista-libreria">
                  
                  {Object.entries(libreriaDatos[categoriaSeleccionada]).map(([subcategoria, ejercicios]) => (
                    <div
                      key={subcategoria}
                      className="subcategoria-item"
                      onClick={() => setSubCategoriaSeleccionada(subcategoria)}
                    >
                      
                      <h2>{subcategoria}</h2>
                      <LottieAnimation jsonPath={`./caratulas/${subcategoria}.json`} />
                    </div>
                    
                  ))}
                </div>
                {subcategoriaSeleccionada && (
                  <div className="ejercicios-container-libreria">
                    <div className="ejercicios-lista-libreria">
                      {libreriaDatos[categoriaSeleccionada][subcategoriaSeleccionada].map(
                        (ejercicio, index) => (
                          <div
                            key={index}
                            className={`ejercicio-item-libreria ${
                              esEjercicioAgregado(ejercicio) ? "ejercicio-agregado" : ""
                            } ${
                              !esEjercicioAgregado(ejercicio) && maxEjercicios !== null && ejerciciosAgregados.length >= maxEjercicios ? "ejercicio-deshabilitado" : ""
                            }`}
                            onClick={() => handleEjercicioClick(ejercicio)}
                          >
                            <p>{ejercicio}</p>
                            <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`} />
                            {esEjercicioAgregado(ejercicio) && <p className="palomita-checked"><FaCheckCircle /></p>}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Libreria;