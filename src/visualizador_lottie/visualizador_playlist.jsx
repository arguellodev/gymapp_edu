import React, { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";
import './visualizador_playlist.css';

const LottieAnimationPlaylist = ({ jsonPaths, setLottieVentana }) => {
  const [animations, setAnimations] = useState([]);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

    console.log(jsonPaths);
  // Configurar Intersection Observer para detectar cuando el componente es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Detecta cuando al menos el 10% del elemento es visible
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Cargar todas las animaciones cuando el componente sea visible
  useEffect(() => {
    const fetchAnimations = async () => {
      if (!isVisible || !jsonPaths || jsonPaths.length === 0) return;
      
      try {
        const animationPromises = jsonPaths.map(async (item) => {
          try {
            const response = await fetch(`./Ejerciciosall/${item.nombre}.json`);
            
            if (!response.ok) {
              throw new Error(`Error al cargar la animación ${item.nombre}: ${response.status}`);
            }
            
            const data = await response.json();
            return {
              id: item.id,
              nombre: item.nombre,
              data,
              loading: false,
              error: null
            };
          } catch (err) {
            console.error(`Error al cargar la animación ${item.nombre}:`, err);
            return {
              id: item.id,
              nombre: item.nombre,
              data: null,
              loading: false,
              error: err.message
            };
          }
        });
        
        const results = await Promise.all(animationPromises);
        setAnimations(results);
      } catch (err) {
        console.error("Error general al cargar animaciones:", err);
      }
    };

    if (isVisible && jsonPaths) {
      // Inicializar el estado con los elementos en carga
      setAnimations(jsonPaths.map(item => ({
        id: item.id,
        nombre: item.nombre,
        data: null,
        loading: true,
        error: null
      })));
      
      fetchAnimations();
    }
  }, [jsonPaths, isVisible]);

  return (
    <div ref={containerRef} className="lottie-gallery-container">
      <div className="lottie-gallery-header">
        <h2>Lista de Ejercicios</h2>
        <button 
          className="lottie-close-button" 
          onClick={() => setLottieVentana(false)}
        >
          <span>×</span>
        </button>
      </div>
      
      {isVisible && (
        <div className="lottie-animations-grid">
          {animations.length === 0 ? (
            <div className="lottie-empty-state">No hay animaciones para mostrar</div>
          ) : (
            animations.map((animation) => (
              <div key={animation.id} className="lottie-card">
                <div className="lottie-card-header">
                  <h3>{animation.nombre}</h3>
                </div>
                <div className="lottie-animation-container">
                  {animation.loading && (
                    <div className="lottie-loading">
                      <div className="lottie-spinner"></div>
                      <p>Cargando...</p>
                    </div>
                  )}
                  
                  {animation.error && (
                    <div className="lottie-error">
                      <p>Error: {animation.error}</p>
                    </div>
                  )}
                  
                  {animation.data && (
                    <Lottie
                      animationData={animation.data}
                      loop={true}
                      autoPlay={true}
                      className="lottie-player"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LottieAnimationPlaylist;