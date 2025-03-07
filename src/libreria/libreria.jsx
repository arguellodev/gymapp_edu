import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import "./libreria.css";
// Importa directamente el JSON
import libreriaDatos from '../data/libreria.json';

const LottieAnimation = ({ jsonPath }) => {
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        console.error(`Error al cargar animación desde ${jsonPath}:`, err);
        setError(err.message);
      }
    };

    loadAnimation();
  }, [jsonPath]);

  if (error) {
    return <div className="error-container">Error al cargar</div>;
  }

  if (!animationData) {
    return <div className="cargando-lottie">Cargando...</div>;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoPlay={true}
      style={{
        width: "50%",
        height: "auto"
      }}
    />
  );
};

const Libreria = () => {
  const [categorias, setCategorias] = useState({});
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usamos los datos importados directamente
    try {
      setCategorias(libreriaDatos);
      
      // Inicializar todas las categorías como colapsadas
      const expandidasInicial = Object.keys(libreriaDatos).reduce((acc, categoria) => {
        acc[categoria] = false;
        return acc;
      }, {});
      setCategoriasExpandidas(expandidasInicial);
      
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setError("No se pudo cargar el catálogo de ejercicios");
      setCargando(false);
    }
  }, []);

  // Manejar la expansión/colapso de una categoría
  const toggleCategoria = (categoria) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  if (cargando) {
    return <div className="cargando">Cargando catálogo de ejercicios...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="libreria-container">
      <h1 className="titulo-principal">Catálogo de Ejercicios</h1>
      
      {Object.keys(categorias).map(categoria => (
        <div key={categoria} className="categoria-container">
          <div 
            className={`categoria-header ${categoriasExpandidas[categoria] ? 'expandido' : ''}`}
            onClick={() => toggleCategoria(categoria)}
          >
            <h2>{categoria}</h2>
            <span className="toggle-icon">{categoriasExpandidas[categoria] ? '−' : '+'}</span>
          </div>
          
          {categoriasExpandidas[categoria] && (
            <div className="ejercicios-grid">
              {categorias[categoria].map((ejercicio, index) => (
                <div key={index} className="ejercicio-card">
                  <h3 className="ejercicio-titulo">{ejercicio}</h3>
                  <div className="lottie-container">
                    <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Libreria;