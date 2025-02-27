import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import "./libreria.css";
// Importa directamente el JSON
import libreriaDatos from '../data/libreria.json';

const Libreria = () => {
  const [categorias, setCategorias] = useState({});
  const [animaciones, setAnimaciones] = useState({});
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ya no necesitamos fetch, usamos los datos importados
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

  // Función para cargar las animaciones de una categoría específica
  const cargarAnimacionesCategoria = async (categoria) => {
    if (animaciones[categoria]) return; // Si ya están cargadas, no hacer nada
    
    const ejerciciosCategoria = categorias[categoria] || [];
    
    try {
      const nuevasAnimaciones = await Promise.all(
        ejerciciosCategoria.map(async (nombreEjercicio) => {
          try {
            // Ajusta la ruta según la estructura real de tu proyecto
            const ruta = `/Ejercicios/${categoria}/${nombreEjercicio}.json`;
            console.log(`Cargando: ${ruta}`);
            
            const response = await fetch(ruta);
            if (!response.ok) {
              throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return { 
              nombre: nombreEjercicio, 
              data 
            };
          } catch (error) {
            console.error(`Error al cargar ${nombreEjercicio}:`, error);
            return { 
              nombre: nombreEjercicio, 
              error: error.message, 
              data: null 
            };
          }
        })
      );
      
      setAnimaciones(prev => ({
        ...prev,
        [categoria]: nuevasAnimaciones
      }));
    } catch (error) {
      console.error(`Error al cargar animaciones de ${categoria}:`, error);
    }
  };

  // El resto del componente permanece igual...

  // Manejar la expansión/colapso de una categoría
  const toggleCategoria = (categoria) => {
    setCategoriasExpandidas(prev => {
      const nuevoEstado = !prev[categoria];
      
      // Si estamos expandiendo, cargar las animaciones
      if (nuevoEstado) {
        cargarAnimacionesCategoria(categoria);
      }
      
      return {
        ...prev,
        [categoria]: nuevoEstado
      };
    });
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
              {animaciones[categoria] ? 
                animaciones[categoria].map((anim, index) => (
                  <div key={index} className="ejercicio-card">
                    <h3 className="ejercicio-titulo">{anim.nombre}</h3>
                    {anim.data ? (
                      <div className="lottie-container">
                        <Lottie 
                          animationData={anim.data} 
                          loop={true} 
                          autoPlay={true}
                          style={{
                            width: "150px",
                            height: "auto"
                          }}
                        />
                      </div>
                    ) : (
                      <div className="error-container">
                        <p>Error al cargar</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="cargando">Cargando ejercicios...</div>
                )
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Libreria;