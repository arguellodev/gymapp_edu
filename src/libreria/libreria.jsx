import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import "./libreria.css";
// Importa directamente el JSON
import libreriaDatos from "../data/nueva_libreria.json";
import LottieAnimation from "../visualizador_lottie/visualizador";

const Libreria = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubCategoriaSeleccionada] =useState(null);

  function handlebackbutton(){
    if(subcategoriaSeleccionada !== null ){
      setSubCategoriaSeleccionada(null);
    }
    else {
      setCategoriaSeleccionada(null);
    }
  }
  return (
    <>
      {/* Iteramos sobre las categorías principales (Tren Superior, Tren inferior, Abdomen) */}
      <div className="libreria-categorias-container">
        {Object.entries(libreriaDatos).map(([categoria]) => (
          <div
            key={categoria}
            className="categoria"
            onClick={() => {
              setCategoriaSeleccionada(categoria);
            }}
          >
            <h2>{categoria}</h2>
          </div>
        ))}
      </div>

      {categoriaSeleccionada !== null && (
        <div>
          {Array.isArray(libreriaDatos[categoriaSeleccionada]) ? (
            <div className="ejercicios-container-libreria">
              <div className="header-libreria">
                <button className="back-button" onClick={handlebackbutton}>Atras</button>
                <p>{categoriaSeleccionada}</p>
              </div>
              <div className="ejercicios-lista-libreria">
                {libreriaDatos[categoriaSeleccionada].map(
                  (ejercicio, index) => (
                    <div key={index} className="ejercicio-item-libreria">
                      <p>{ejercicio}</p>
                      <LottieAnimation
                        jsonPath={`./Ejerciciosall/${ejercicio}.json`}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            // Si no es array, es un objeto con subcategorías (Antebrazo, etc.)

            <div className="subcategorias-container-libreria">
              <div className="header-libreria">
                <button className="back-button" onClick={handlebackbutton}>Atras</button>
                <p>{categoriaSeleccionada} {subcategoriaSeleccionada}</p>
              </div>
              {Object.entries(libreriaDatos[categoriaSeleccionada]).map(
                ([subcategoria, ejercicios]) => (
                  <div key={subcategoria} className="subcategoria">
                    <div
                      onClick={() => {
                        setSubCategoriaSeleccionada(subcategoria);
                      }}
                    >
                      <p>{subcategoria}</p>
                    </div>
                  </div>
                )
              )}
              {subcategoriaSeleccionada !== null && (
                <div className="ejercicios-container-libreria">
                 
                  <div className="ejercicios-lista-libreria">
                  {libreriaDatos[categoriaSeleccionada][
                    subcategoriaSeleccionada
                  ].map((ejercicio, index) => (
                    <div key={index} className="ejercicio-item-libreria">
                      <p>{ejercicio}</p>
                      <LottieAnimation
                        jsonPath={`./Ejerciciosall/${ejercicio}.json`}
                      />
                    </div>
                  ))}
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
