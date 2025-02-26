import React, { useEffect, useState } from 'react';
import './entrada.css'; // Importamos los estilos CSS

const LoadingScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Simulamos la carga incrementando el progreso gradualmente
    const interval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="loading-container">
      <div className="logo-container">
        <img 
          src="logo.png" 
          alt="Logo de la aplicación" 
          className="logo pulse-animation"
        />
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      
      <div className="loading-text">
        Cargando... {loadingProgress}%
      </div>
    </div>
  );
};

export default LoadingScreen;