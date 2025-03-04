import React from "react";
import Lottie from "lottie-react";

const LottieAnimation = ({ jsonPath }) => {
  const [animationData, setAnimationData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchAnimation = async () => {
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

    if (jsonPath) {
      fetchAnimation();
    }
  }, [jsonPath]);

  if (loading) {
    return <div className="lottie-loading">Cargando animación...</div>;
  }

  if (error) {
    return <div className="lottie-error">Error: {error}</div>;
  }

  return (
    <div className="lottie-container-creadorRutina">
      <Lottie 
    
        animationData={animationData} 
        loop={true} 
        autoPlay={true}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

export default LottieAnimation;