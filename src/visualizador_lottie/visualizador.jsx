import React, { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";

const LottieAnimation = ({ jsonPath }) => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

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

  // Cargar la animación solo cuando el componente sea visible
  useEffect(() => {
    const fetchAnimation = async () => {
      if (!isVisible || animationData) return;
      
      try {
        setLoading(true);
        
        // Cargar el archivo JSON de la ruta proporcionada
        const response = await fetch(jsonPath);
        
        if (!response.ok) {
          throw new Error(`Error al cargar la animación: ${response.status}`);
        }
        
        const data = await response.json();
        setAnimationData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar la animación Lottie:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (jsonPath && isVisible) {
      fetchAnimation();
    }
  }, [jsonPath, isVisible, animationData]);

  return (
    <div ref={containerRef} className="lottie-container-creadorRutina">
      {isVisible && (
        <>
          {loading && <div className="lottie-loading">Cargando animación...</div>}
          
          {error && <div className="lottie-error">Error: {error}</div>}
          
          {animationData && (
            <Lottie 
              animationData={animationData} 
              loop={true} 
              autoPlay={true}
              style={{
                width: "auto",
    height: "100%",
    objectFit: "contain",
    overflow: "hidden"
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LottieAnimation;