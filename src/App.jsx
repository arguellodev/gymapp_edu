import React, { useState, useEffect } from 'react';
import Navbar from './navbar/navbar';
import Rutina from './rutina/rutina';
import Inicio from './inicio/inicio';
import Perfil from './perfil/perfil';
import Libreria from './libreria/libreria';
import LoadingScreen from './entrada/entrada';
import { CgHome, CgPerformance, CgGym, CgProfile } from "react-icons/cg";
import { FaSearchengin } from "react-icons/fa";
import Formulario from './formulario/formulario';
import CrearRutina from './crearRutina/crearRutina';
const App = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Índice activo del menú
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión
  const [hasUserData, setHasUserData] = useState(false); // Estado de datos completos
  const [userData, setUserData] = useState(null); // Datos del usuario
  
  // Ítems del menú de navegación
  const navItems = [
    { icon: <CgHome />, texto: 'Inicio', link: '/' },
    { icon: <CgGym />, texto: 'Rutina', link: '/about' },
    { icon: <CgPerformance />, texto: 'Progreso', link: '/services' },
    { icon: <FaSearchengin />, texto: 'Ejercicios' },
  ];
  
  // Verificar estado del usuario
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        const storedUserData = localStorage.getItem('userData');
        
        if (userToken) {
          setIsLoggedIn(true);
          if (storedUserData) {
            try {
              setUserData(JSON.parse(storedUserData)); // Convertir a objeto
              setHasUserData(true);
            } catch (error) {
              console.error("Error al parsear userData:", error);
              localStorage.removeItem('userData'); // Eliminar datos corruptos
            }
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.error("Error al verificar el estado del usuario:", e);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Simula un tiempo de carga
      }
    };
    
    checkUserStatus();
  }, []);
  
  // Manejar actualización de datos del usuario tras completar el formulario
  const handleOnboardingComplete = (newUserData) => {
    setUserData(newUserData);
    setHasUserData(true);
  };
  
  // Manejar la selección de menú
  const handleNavItemClick = (index) => {
    setActiveIndex(index);
  };
  
  // Renderizado condicional
  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen />;
    } else if (!isLoggedIn) {
      localStorage.setItem('userToken', 'demo-token');
              setIsLoggedIn(true);
      
    } else if (!hasUserData) {
      return <Formulario onComplete={handleOnboardingComplete} />;
    } else {
      return (
        <>
          <div className="main" style={{ width: "100%", height: "calc(100% - 55px)", marginBottom: "100px", marginTop: "20px" }}>
            {activeIndex === 0 && <Inicio setActiveIndex={setActiveIndex} userData={userData} />}
            {activeIndex === 1 && <Rutina activeIndex={activeIndex} />}
            {activeIndex === 2 && <Perfil userData={userData}/> }
            {activeIndex === 3 && <Libreria />}
          </div>
          
          <Navbar items={navItems} activeIndex={activeIndex} onNavItemClick={handleNavItemClick} />
        </>
      );
    }
  };
  
  return <div>{renderContent()}</div>;
};

export default App;