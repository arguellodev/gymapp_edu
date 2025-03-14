import React, { useState } from "react";
import Lottie from "lottie-react";
import "./libreria.css";
import { IoMdArrowBack } from "react-icons/io";
import libreriaDatos from "../data/nueva_libreria.json";
import LottieAnimation from "../visualizador_lottie/visualizador";

const Libreria = ({ type, onEjercicioSeleccionado, tipoBloque, ejerciciosAgregados }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubCategoriaSeleccionada] = useState(null);

  const handleatras= ()=>{
    if(subcategoriaSeleccionada!== null){
      setSubCategoriaSeleccionada(null)
    }
    else{
      setCategoriaSeleccionada(null);
    }
  }
  // Función para manejar el clic en un ejercicio
  const handleEjercicioClick = (ejercicio) => {
    if (type === "creador-rutina" && onEjercicioSeleccionado) {
      onEjercicioSeleccionado(ejercicio); // Llama a la función para agregar/eliminar el ejercicio
    }
  };

  // Función para verificar si un ejercicio ya fue agregado
  const esEjercicioAgregado = (ejercicio) => {
    if (type === "creador-rutina" && ejerciciosAgregados) {
      return ejerciciosAgregados.some((e) => e.nombre === ejercicio);
    }
    return false; // Si no es "creador-rutina", no marca como agregado
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

  return (
    <>
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

      {categoriaSeleccionada && (
        <div>
          {Array.isArray(libreriaDatos[categoriaSeleccionada]) ? (
            <div className="ejercicios-container-libreria">
              <div className="header-libreria">
                <button className="boton-atras" onClick={() => handleatras()}>
                  <IoMdArrowBack />
                </button>
                <p>{categoriaSeleccionada}</p>
              </div>
              <div className="ejercicios-lista-libreria">
                {libreriaDatos[categoriaSeleccionada].map((ejercicio, index) => (
                  <div
                    key={index}
                    className={`ejercicio-item-libreria ${
                      esEjercicioAgregado(ejercicio) ? "ejercicio-agregado" : ""
                    }`}
                    onClick={() => handleEjercicioClick(ejercicio)}
                  >
                    <p>{ejercicio}</p>
                    <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`} />
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
                          }`}
                          onClick={() => handleEjercicioClick(ejercicio)}
                        >
                          <p>{ejercicio}</p>
                          <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`} />
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
    </>
  );
};

export default Libreria;