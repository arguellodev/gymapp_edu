import React from 'react';
import './navbar.css';

const Navbar = ({ items, activeIndex, onNavItemClick }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {items.map((item, index) => (
          <li
            key={index}
            className={`navbar-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => onNavItemClick(index)} // Llama la función para actualizar el índice
          >
            <span className="icon">{item.icon}</span>
            {activeIndex === index && <span className="texto">{item.texto}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
