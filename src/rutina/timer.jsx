import React, { useState, useEffect } from 'react';
import './timer.css';

const Timer = ({ seconds, onComplete, esUltimoEjercicio }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [circumference, setCircumference] = useState(0);
  const radius = 150;

  useEffect(() => {
    // Verificar si el tiempo es cero o no es un número válido
    if (seconds <= 0 || isNaN(seconds)) {
      onComplete && onComplete(); // Llamar a onComplete automáticamente
      return;
    }

    const totalTime = seconds;
    const circle = 2 * Math.PI * radius;
    setCircumference(circle);

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          onComplete && onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  // Si el tiempo es cero o no es un número válido, no renderizar el temporizador
  if (seconds <= 0 || isNaN(seconds)) {
    return null; // O puedes retornar un mensaje o componente alternativo
  }

  // Calcular minutos y segundos solo si timeLeft es válido
  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  // Calcular progress solo si seconds es un número válido y mayor que 0
  const progress = circumference - (timeLeft / seconds) * circumference;

  const handleSkip = () => {
    // Llamar a onComplete para quitar el temporizador
    onComplete && onComplete();
  };

  return (
    <div className="timer-overlay">
      <h2>Toma tu descanso entre {esUltimoEjercicio ? 'series' : 'ejercicios'}</h2>
      <div className="timer-container">
        <svg className="timer-svg" width="350" height="350" viewBox="0 0 350 350">
          <circle 
            cx="175" 
            cy="175" 
            r={radius} 
            fill="none" 
            stroke="#e0e0e0" 
            strokeWidth="20"
          />
          <defs>
    <filter id="glow">
      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#0b7dda" floodOpacity="1"/>
    </filter>
  </defs>
  <circle 
    cx="175" 
    cy="175" 
    r={radius} 
    fill="none" 
    stroke="#0b7dda" 
    strokeWidth="20"
    strokeDasharray={circumference}
    strokeDashoffset={isNaN(progress) ? 0 : progress} // Evitar NaN
    className="timer-progress"
    filter="url(#glow)"
  />
      
        </svg>
        <div className="timer-text">
          <div className="timer-time">
            {minutes.toString().padStart(2, '0')}:
            {remainingSeconds.toString().padStart(2, '0')}
          </div>
        </div>
        <button className="timer-skip-button" onClick={handleSkip}>
          Saltar
        </button>
      </div>
    </div>
  );
};

export default Timer;