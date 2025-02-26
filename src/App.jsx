import React, { useState } from 'react';
import Navbar from './navbar/navbar';
import Rutina from './rutina/rutina';
import Inicio from './inicio/inicio';
import Perfil from './perfil/perfil';
import { CgHome } from "react-icons/cg";
import { SlSpeedometer } from "react-icons/sl";
import { CgPerformance } from "react-icons/cg";
import { CgGym } from "react-icons/cg";
import { CgProfile } from "react-icons/cg";

const App = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Mantén el estado del índice activo
  const navItems = [
    { icon: <CgHome />, texto: 'Inicio', link: '/' },
    { icon: <CgGym />, texto: 'Rutina', link: '/about' },
    { icon: <CgPerformance />, texto: 'Progreso', link: '/services' },
    
  ];

  // Función que actualiza el índice activo
  const handleNavItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <div className="main" style={{width: "100%", height:"auto", marginBottom:'100px'}}>
      {activeIndex == 0 && <Inicio setActiveIndex={setActiveIndex}/> }
      {activeIndex == 1 && <Rutina activeIndex={activeIndex} /> }
      {activeIndex == 2 && <Perfil></Perfil>}
      </div>
      
      <Navbar items={navItems} activeIndex={activeIndex} onNavItemClick={handleNavItemClick} />
      
    </div>
  );
};

export default App;
